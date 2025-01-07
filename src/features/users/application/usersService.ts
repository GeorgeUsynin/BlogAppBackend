import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import { UsersRepository } from '../infrastructure';
import { ResultStatus } from '../../../constants';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { APIError } from '../../shared/helpers';
import { TUser } from '../domain/userEntity';
import { SETTINGS } from '../../../app-settings';
import { CreateUserInputDTO } from './dto';

@injectable()
export class UsersService {
    constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}

    async createUser(payload: CreateUserInputDTO) {
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
            emailConfirmation: {
                isConfirmed: true,
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), { hours: 1 }),
            },
        });

        return this.usersRepository.createUser(newUser);
    }

    async findUserById(userId: string) {
        return this.usersRepository.findUserById(userId);
    }

    async deleteUserById(userId: string) {
        const foundUser = await this.usersRepository.findUserById(userId);

        if (!foundUser) {
            throw new APIError({ status: ResultStatus.NotFound, message: 'User not found' });
        }

        foundUser.isDeleted = true;

        await this.usersRepository.save(foundUser);
    }
}
