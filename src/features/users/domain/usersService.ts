import bcrypt from 'bcrypt';
import { usersRepository } from '../repository';
import { JWTService } from '../../shared/services';
import type { CreateUserInputModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';
import { ResultStatus } from '../../../constants';
import { SETTINGS } from '../../../app-settings';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { APIError } from '../../shared/helpers';

const accessTokenExpirationTime = SETTINGS.ACCESS_TOKEN_EXPIRATION_TIME;
const refreshTokenExpirationTime = SETTINGS.REFRESH_TOKEN_EXPIRATION_TIME;

export const usersService = {
    async login(loginOrEmail: string, password: string) {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail, loginOrEmail);

        if (!user) {
            throw new APIError({
                status: ResultStatus.Unauthorized,
                message: 'Invalid credentials',
            });
        }

        // check if user's email is confirmed
        if (!user.emailConfirmation.isConfirmed) {
            throw new APIError({
                status: ResultStatus.Unauthorized,
                message: 'Email is not confirmed',
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            throw new APIError({
                status: ResultStatus.Unauthorized,
                message: 'Invalid credentials',
            });
        }

        const accessToken = JWTService.createJWTToken(
            { userId: user._id.toString() },
            { expiresIn: accessTokenExpirationTime }
        );
        const refreshToken = JWTService.createJWTToken(
            { userId: user._id.toString() },
            { expiresIn: refreshTokenExpirationTime }
        );

        return { accessToken, refreshToken };
    },
    async logout(userId: string, refreshToken: string) {
        await usersRepository.updateUserRevokedRefreshTokenList(userId, refreshToken);
    },
    async revokeRefreshToken(userId: string, refreshToken: string) {
        await usersRepository.updateUserRevokedRefreshTokenList(userId, refreshToken);

        const accessToken = JWTService.createJWTToken({ userId }, { expiresIn: accessTokenExpirationTime });
        const newRefreshToken = JWTService.createJWTToken({ userId }, { expiresIn: refreshTokenExpirationTime });

        return { accessToken, newRefreshToken };
    },
    async checkRefreshTokenAlreadyBeenUsed(userId: string, refreshToken: string) {
        const user = await usersRepository.findUserById(userId);

        const isRefreshTokenAlreadyBeenUsed = user!.revokedRefreshTokenList.some(token => token === refreshToken);

        return isRefreshTokenAlreadyBeenUsed;
    },
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
