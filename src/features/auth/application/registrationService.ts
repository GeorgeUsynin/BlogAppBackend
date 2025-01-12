import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import { UsersRepository } from '../../users/infrastructure';
import { ResultStatus } from '../../../constants';
import { EmailManager } from '../../shared/application/managers/emailManager';
import { APIError } from '../../shared/helpers';
import { SETTINGS } from '../../../app-settings';
import { UserModel } from '../../users/domain';
import { RegistrationInputDTO } from './dto';

@injectable()
export class RegistrationService {
    constructor(
        @inject(UsersRepository) private usersRepository: UsersRepository,
        @inject(EmailManager) private emailManager: EmailManager
    ) {}

    async registerUser(payload: RegistrationInputDTO) {
        const { login, email, password } = payload;

        // check if user already exists
        const userWithLogin = await this.usersRepository.findUserByLogin(login);
        const userWithEmail = await this.usersRepository.findUserByEmail(email);

        if (userWithLogin || userWithEmail) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: userWithLogin ? 'login' : 'email',
                message: `User with this ${userWithLogin ? 'login' : 'email'} already exists`,
            });
        }

        // hash password
        const passwordHash = await bcrypt.hash(password, SETTINGS.HASH_ROUNDS);

        // create new user
        const newUser = UserModel.createUnconfirmedUser({
            login,
            email,
            passwordHash,
        });

        await this.usersRepository.save(newUser);

        // sent confirmation email
        this.emailManager.sendPasswordConfirmationEmail(email, newUser.emailConfirmation.confirmationCode);
    }

    async registrationConfirmation(code: string) {
        const user = await this.usersRepository.findUserByConfirmationEmailCode(code);

        if (!user) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: 'code',
                message: 'Invalid code',
            });
        }

        if (user.canBeConfirmed(code)) {
            user.confirmUserEmail(code);
        }

        await this.usersRepository.save(user);
    }

    async registrationEmailResending(email: string) {
        const user = await this.usersRepository.findUserByEmail(email);

        if (!user) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: 'email',
                message: 'User with this email not found',
            });
        }

        if (user.canResendEmailConfirmationCode()) {
            user.generateEmailConfirmationCode();
            const newConfirmationCode = user.emailConfirmation.confirmationCode;
            await this.usersRepository.save(user);

            this.emailManager.sendPasswordConfirmationEmail(email, newConfirmationCode);
        }
    }
}
