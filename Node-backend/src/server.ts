import express from "express";
import { testDatabaseConnection } from "./config/database.js";
import healthRouter from "./routes/health.route.js";
import usersRouter from "./routes/users.route.js";

const app = express();

app.use(express.json());
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/users", usersRouter);

const PORT = 3000;

async function startServer(): Promise<void> {
    await testDatabaseConnection();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer().catch(() => {
    process.exitCode = 1;
});
