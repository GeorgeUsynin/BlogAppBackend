import bcrypt from 'bcrypt';
import { add } from 'date-fns/add';
import { randomUUID } from 'crypto';
import { usersRepository } from '../../users/repository';
import { RegistrationInputModel } from '../models';
import { ResultStatus } from '../../../constants';
import { TDatabase } from '../../../database';
import { emailManager } from '../../shared/managers/emailManager';
import { APIError } from '../../shared/helpers';
import { SETTINGS } from '../../../app-settings';
import { TUser } from '../../users/domain';

export const registrationService = {
    async registerUser(payload: RegistrationInputModel) {
        const { login, email, password } = payload;

        // check if user already exists
        const userWithLogin = await usersRepository.findUserByLogin(login);
        const userWithEmail = await usersRepository.findUserByEmail(email);

        if (userWithLogin || userWithEmail) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: userWithLogin ? 'login' : 'email',
                message: `User with this ${userWithLogin ? 'login' : 'email'} already exists`,
            });
        }

        // hash password
        const hash = await bcrypt.hash(password, 10);

        // create new user
        const newUser: TUser = {
            login,
            email,
            passwordHash: hash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                isConfirmed: false,
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), { hours: SETTINGS.CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS }),
            },
        };

        await usersRepository.createUser(newUser);

        // sent confirmation email
        emailManager.sendPasswordConfirmationEmail(email, newUser.emailConfirmation.confirmationCode);
    },
    async registrationConfirmation(code: string) {
        const user = await usersRepository.findUserByConfirmationCode(code);

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

        await usersRepository.updateUserEmailConfirmation(user._id.toString(), true);
    },
    async registrationEmailResending(email: string) {
        const user = await usersRepository.findUserByEmail(email);

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

        await usersRepository.updateUserEmailConfirmationCode(
            user._id.toString(),
            newConfirmationCode,
            newExpirationDate
        );

        emailManager.sendPasswordConfirmationEmail(email, newConfirmationCode);
    },
};
