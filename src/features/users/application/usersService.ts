import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import { UsersRepository } from '../infrastructure';
import { ResultStatus } from '../../../constants';
import { APIError } from '../../shared/helpers';
import { UserModel } from '../domain/userEntity';
import { SETTINGS } from '../../../app-settings';
import { CreateUserInputDTO } from './dto';

@injectable()
export class UsersService {
    constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}

    async createUser(payload: CreateUserInputDTO) {
        const { email, login, password } = payload;

        const user = await this.usersRepository.findUserByLoginOrEmail(login, email);

        if (user) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                message: 'User with this login or email already exists',
            });
        }

        const passwordHash = await bcrypt.hash(password, SETTINGS.HASH_ROUNDS);

        const newUser = UserModel.createConfirmedUser({ email, login, passwordHash });

        return this.usersRepository.save(newUser);
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
