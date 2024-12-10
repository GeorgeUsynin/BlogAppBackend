import bcrypt from 'bcrypt';
import { usersRepository } from '../repository';
import { JWTService } from '../../shared/services';
import type { CreateUserInputModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';

export const usersService = {
    login: async (loginOrEmail: string, password: string) => {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail, loginOrEmail);

        if (!user) {
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            return null;
        }

        return { accessToken: JWTService.createJWTToken(user._id.toString()) };
    },
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
    deleteUserById: async (userId: string) => usersRepository.deleteUserById(userId),
};
