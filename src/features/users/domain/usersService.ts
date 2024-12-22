import bcrypt from 'bcrypt';
import { usersRepository } from '../repository';
import { ResultStatus } from '../../../constants';
import { SETTINGS } from '../../../app-settings';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { APIError } from '../../shared/helpers';
import type { CreateUserInputModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';

export const usersService = {
    async createUser(payload: CreateUserInputModel) {
        const user = await usersRepository.findUserByLoginOrEmail(payload.login, payload.email);

        if (user) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                message: 'User with this login or email already exists',
            });
        }

        const hash = await bcrypt.hash(payload.password, 10);

        const newUser: Omit<TDatabase.TUser, '_id'> = {
            ...payload,
            passwordHash: hash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                isConfirmed: true,
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), { hours: 1 }),
            },
            revokedRefreshTokenList: [],
        };

        return await usersRepository.createUser(newUser);
    },
    async findUserById(userId: string) {
        return await usersRepository.findUserById(userId);
    },
    async deleteUserById(userId: string) {
        const foundUser = await usersRepository.deleteUserById(userId);

        if (!foundUser) {
            throw new APIError({ status: ResultStatus.NotFound, message: 'User not found' });
        }
    },
};
