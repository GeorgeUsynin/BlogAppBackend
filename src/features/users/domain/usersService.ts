import bcrypt from 'bcrypt';
import { UsersRepository } from '../repository';
import { ResultStatus } from '../../../constants';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { APIError } from '../../shared/helpers';
import { TUser } from './userEntity';
import { SETTINGS } from '../../../app-settings';
import type { CreateUserInputModel } from '../models';

export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async createUser(payload: CreateUserInputModel) {
        const user = await this.usersRepository.findUserByLoginOrEmail(payload.login, payload.email);

        if (user) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                message: 'User with this login or email already exists',
            });
        }

        const hash = await bcrypt.hash(payload.password, SETTINGS.HASH_ROUNDS);

        const newUser = new TUser({
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
        });

        return this.usersRepository.createUser(newUser);
    }

    async findUserById(userId: string) {
        return this.usersRepository.findUserById(userId);
    }

    async deleteUserById(userId: string) {
        const foundUser = await this.usersRepository.deleteUserById(userId);

        if (!foundUser) {
            throw new APIError({ status: ResultStatus.NotFound, message: 'User not found' });
        }
    }
}
