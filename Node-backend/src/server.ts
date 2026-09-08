import express from "express";

const app = express();

app.use(express.json());

const PORT = 3000;

app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});