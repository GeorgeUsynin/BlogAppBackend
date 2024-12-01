import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { usersRepository, queryUsersRepository } from '../repository';
import type { CreateUserInputModel } from '../models';
import { usersCollection, type TDatabase } from '../../../database/mongoDB';

export const usersService = {
    createUser: async (payload: CreateUserInputModel) => {
        const user = await queryUsersRepository.findUserByLoginOrEmail(payload.login, payload.email);

        if (user) {
            return {
                errorsMessages: [
                    {
                        message: 'User with this login or email already exists',
                        field: '',
                    },
                ],
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await usersService.generateHash(payload.password, salt);

        const newUser: Omit<TDatabase.TUser, '_id'> = {
            ...payload,
            passwordHash: hash,
            passwordSalt: salt,
            createdAt: new Date().toISOString(),
        };

        return usersRepository.createUser(newUser);
    },
    deleteUserById: async (userId: string) => usersRepository.deleteUserById(new ObjectId(userId)),
    generateHash: async (password: string, salt: string) => await bcrypt.hash(password, salt),
};
