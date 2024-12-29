import bcrypt from 'bcrypt';
import { usersRepository } from '../repository';
import { ResultStatus } from '../../../constants';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { APIError } from '../../shared/helpers';
import { TUser } from './userEntity';
import { SETTINGS } from '../../../app-settings';
import type { CreateUserInputModel } from '../models';

export const usersService = {
    async createUser(payload: CreateUserInputModel) {
        const user = await usersRepository.findUserByLoginOrEmail(payload.login, payload.email);

        if (user) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                message: 'User with this login or email already exists',
            });
        }

        const hash = await bcrypt.hash(payload.password, SETTINGS.HASH_ROUNDS);

        const newUser: TUser = {
            ...payload,
            passwordHash: hash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                isConfirmed: true,
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), { hours: 1 }),
            },
            passwordRecovery: {
                expirationDate: null,
                recoveryCode: null,
            },
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
