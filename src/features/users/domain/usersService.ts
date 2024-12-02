import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { usersRepository } from '../repository';
import type { CreateUserInputModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';

export const usersService = {
    createUser: async (payload: CreateUserInputModel) => {
        const user = await usersRepository.findUserByLoginOrEmail(payload.login, payload.email);

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

        const hash = await bcrypt.hash(payload.password, 10);

        const newUser: Omit<TDatabase.TUser, '_id'> = {
            ...payload,
            passwordHash: hash,
            createdAt: new Date().toISOString(),
        };

        return usersRepository.createUser(newUser);
    },
    deleteUserById: async (userId: string) => usersRepository.deleteUserById(new ObjectId(userId)),
};
