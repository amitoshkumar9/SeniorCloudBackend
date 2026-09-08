import type { Request, Response } from "express";
import { getHealthStatus } from "../services/health.service.js";

export function getHealth(req: Request, res: Response) {
    const result = getHealthStatus();

    res.status(200).json(result);
}