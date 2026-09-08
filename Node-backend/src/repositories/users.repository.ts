import { pool } from "../config/database.js";
import type { User } from "../types/user.js";

interface UserRow {
    id: string;
    name: string;
    email: string;
}

export class DuplicateEmailError extends Error {
    constructor() {
        super("A user with this email already exists");
        this.name = "DuplicateEmailError";
    }
}

export async function getAllUsers(): Promise<User[]> {
    const result = await pool.query<UserRow>(
        "SELECT id, name, email FROM users ORDER BY id ASC",
    );

    return result.rows.map(toUser);
}

export async function getUserById(id: string): Promise<User | undefined> {
    const result = await pool.query<UserRow>(
        "SELECT id, name, email FROM users WHERE id = $1",
        [id],
    );

    const row = result.rows[0];
    return row ? toUser(row) : undefined;
}

export async function createUser(name: string, email: string): Promise<User> {
    try {
        const result = await pool.query<UserRow>(
            "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email",
            [name, email],
        );

        return toUser(result.rows[0]!);
    } catch (error) {
        if (isEmailUniqueConstraintViolation(error)) {
            throw new DuplicateEmailError();
        }

        throw error;
    }
}

function toUser(row: UserRow): User {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
    };
}

function isEmailUniqueConstraintViolation(error: unknown): boolean {
    if (typeof error !== "object" || error === null) {
        return false;
    }

    const databaseError = error as { code?: unknown; constraint?: unknown };

    return databaseError.code === "23505" && databaseError.constraint === "users_email_key";
}
