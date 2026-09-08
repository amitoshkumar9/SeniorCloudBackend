import "dotenv/config";
import { Pool } from "pg";

function requiredEnvironmentVariable(name: string, allowEmpty = false): string {
    const value = process.env[name];

    if (value === undefined || (!allowEmpty && !value)) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

function getPort(): number {
    const port = Number(requiredEnvironmentVariable("DB_PORT"));

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("DB_PORT must be a valid port number");
    }

    return port;
}

export const pool = new Pool({
    host: requiredEnvironmentVariable("DB_HOST"),
    port: getPort(),
    database: requiredEnvironmentVariable("DB_NAME"),
    user: requiredEnvironmentVariable("DB_USER"),
    password: requiredEnvironmentVariable("DB_PASSWORD"),
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
});

export async function testDatabaseConnection(): Promise<void> {
    try {
        await pool.query("SELECT 1");
        console.log("PostgreSQL connection established");
    } catch (error) {
        console.error("Unable to connect to PostgreSQL during startup", error);
        throw error;
    }
}
