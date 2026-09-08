import type { Request, Response } from "express";
import { DuplicateEmailError } from "../repositories/users.repository.js";
import { createUser, getUserById, getUsers } from "../services/users.service.js";
import type { CreateUserInput } from "../types/user.js";

export async function listUsers(_req: Request, res: Response): Promise<void> {
    res.status(200).json(await getUsers());
}

export async function getUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (typeof id !== "string" || !isValidUserId(id)) {
        res.status(400).json({
            error: { code: "VALIDATION_ERROR", message: "id must be a valid path parameter" },
        });
        return;
    }

    const user = await getUserById(id);

    if (!user) {
        res.status(404).json({ error: { code: "USER_NOT_FOUND", message: "User was not found" } });
        return;
    }

    res.status(200).json(user);
}

export async function createUserHandler(req: Request, res: Response): Promise<void> {
    const input = parseCreateUserInput(req.body);

    if (!input) {
        res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "name must be a non-empty string and email must be a valid email address",
            },
        });
        return;
    }

    try {
        res.status(201).json(await createUser(input));
    } catch (error) {
        if (error instanceof DuplicateEmailError) {
            res.status(409).json({
                error: {
                    code: "EMAIL_ALREADY_EXISTS",
                    message: "A user with this email already exists",
                },
            });
            return;
        }

        throw error;
    }
}

function parseCreateUserInput(body: unknown): CreateUserInput | undefined {
    if (!body || typeof body !== "object") return undefined;

    const { name, email } = body as Record<string, unknown>;

    if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !isValidEmail(email)) {
        return undefined;
    }

    return { name: name.trim(), email: email.trim().toLowerCase() };
}

function isValidEmail(email: string): boolean {
    return /^\S+@\S+\.\S+$/.test(email);
}

function isValidUserId(id: string): boolean {
    return /^[1-9]\d*$/.test(id);
}
