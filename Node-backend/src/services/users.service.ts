import type { CreateUserInput, User } from "../types/user.js";
import * as usersRepository from "../repositories/users.repository.js";

export async function getUsers(): Promise<User[]> {
    return usersRepository.getAllUsers();
}

export async function getUserById(id: string): Promise<User | undefined> {
    return usersRepository.getUserById(id);
}

export async function createUser(input: CreateUserInput): Promise<User> {
    return usersRepository.createUser(input.name, input.email);
}
