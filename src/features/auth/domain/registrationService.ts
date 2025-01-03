import bcrypt from 'bcrypt';
import { add } from 'date-fns/add';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../../users/repository';
import { RegistrationInputModel } from '../models';
import { ResultStatus } from '../../../constants';
import { EmailManager } from '../../shared/managers/emailManager';
import { APIError } from '../../shared/helpers';
import { SETTINGS } from '../../../app-settings';
import { TUser } from '../../users/domain';

export class RegistrationService {
    constructor(private usersRepository: UsersRepository, private emailManager: EmailManager) {}

    async registerUser(payload: RegistrationInputModel) {
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
        const hash = await bcrypt.hash(password, SETTINGS.HASH_ROUNDS);

        // create new user
        const newUser = new TUser({
            login,
            email,
            passwordHash: hash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                isConfirmed: false,
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), { hours: SETTINGS.CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS }),
            },
            passwordRecovery: {
                expirationDate: null,
                recoveryCode: null,
            },
        });

        await this.usersRepository.createUser(newUser);

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

        if (user.emailConfirmation.isConfirmed) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: 'code',
                message: 'Email already confirmed',
            });
        }

        if (Date.now() > user.emailConfirmation.expirationDate.getTime()) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: 'code',
                message: 'Code expired',
            });
        }

        await this.usersRepository.updateUserEmailConfirmation(user._id.toString(), true);
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

        if (user.emailConfirmation.isConfirmed) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: 'email',
                message: 'Email already confirmed',
            });
        }

        const newConfirmationCode = randomUUID();
        const newExpirationDate = add(new Date(), { hours: SETTINGS.CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS });

        await this.usersRepository.updateUserEmailConfirmationCode(
            user._id.toString(),
            newConfirmationCode,
            newExpirationDate
        );

        this.emailManager.sendPasswordConfirmationEmail(email, newConfirmationCode);
    }
}
