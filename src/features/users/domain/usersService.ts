import bcrypt from 'bcrypt';
import { usersRepository } from '../repository';
import { JWTService } from '../../shared/services';
import type { CreateUserInputModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';
import { Result } from '../../shared/types';
import { ResultStatus } from '../../../constants';
import { InsertOneResult, WithId } from 'mongodb';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

export const usersService = {
    async login(loginOrEmail: string, password: string): Promise<Result<{ accessToken: string } | null>> {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail, loginOrEmail);

        if (!user) {
            return { data: null, status: ResultStatus.Unauthorized };
        }

        // check if user's email is confirmed
        if (!user.emailConfirmation.isConfirmed) {
            return { data: null, status: ResultStatus.Unauthorized };
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            return { data: null, status: ResultStatus.Unauthorized };
        }

        const data = { accessToken: JWTService.createJWTToken(user._id.toString()) };

        return { data, status: ResultStatus.Success };
    },
    async createUser(payload: CreateUserInputModel): Promise<Result<InsertOneResult<TDatabase.TUser> | null>> {
        const user = await usersRepository.findUserByLoginOrEmail(payload.login, payload.email);

        if (user) {
            return {
                data: null,
                errorsMessages: [
                    {
                        message: 'User with this login or email already exists',
                        field: '',
                    },
                ],
                status: ResultStatus.BadRequest,
            };
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
        };

        const data = await usersRepository.createUser(newUser);

        return { data, status: ResultStatus.Success };
    },
    async deleteUserById(userId: string): Promise<Result<WithId<TDatabase.TUser> | null>> {
        const data = await usersRepository.deleteUserById(userId);

        if (!data) {
            return { data: null, status: ResultStatus.NotFound };
        }

        return { data, status: ResultStatus.Success };
    },
};
