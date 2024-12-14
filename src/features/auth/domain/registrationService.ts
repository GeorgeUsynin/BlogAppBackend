import bcrypt from 'bcrypt';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { add } from 'date-fns/add';
import { randomUUID } from 'crypto';
import { usersRepository } from '../../users/repository';
import { RegistrationInputModel } from '../models';
import { ResultStatus } from '../../../constants';
import { TDatabase } from '../../../database/mongoDB';
import { emailManager } from '../../shared/managers/emailManager';
import { Result } from '../../shared/types';

export const registrationService = {
    async registerUser(payload: RegistrationInputModel): Promise<Result<SMTPTransport.SentMessageInfo | null>> {
        const { login, email, password } = payload;

        // check if user already exists
        const user = await usersRepository.findUserByLoginOrEmail(login, email);

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

        // hash password
        const hash = await bcrypt.hash(password, 10);

        // create new user
        const newUser: Omit<TDatabase.TUser, '_id'> = {
            login,
            email,
            passwordHash: hash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                isConfirmed: false,
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), { hours: 1 }),
            },
        };

        const createdUser = await usersRepository.createUser(newUser);

        // check if user was created
        if (!createdUser.acknowledged) {
            return {
                data: null,
                status: ResultStatus.Failure,
                errorsMessages: [{ field: '', message: 'Data insertion failed' }],
            };
        }

        // sent confirmation email
        const { data, status, errorsMessages } = await emailManager.sendPasswordConfirmationEmail(
            email,
            newUser.emailConfirmation.confirmationCode
        );

        // check if email was sent
        if (!data || data.accepted.length === 0) {
            await usersRepository.deleteUserById(createdUser.insertedId.toString());
            return {
                data: null,
                status,
                errorsMessages,
            };
        }

        return { data, status };
    },
    async registrationConfirmation(code: string): Promise<Result<null>> {
        const user = await usersRepository.findUserByConfirmationCode(code);

        if (!user) {
            return {
                data: null,
                status: ResultStatus.BadRequest,
                errorsMessages: [{ field: 'code', message: 'Invalid code' }],
            };
        }

        if (user.emailConfirmation.isConfirmed) {
            return {
                data: null,
                status: ResultStatus.BadRequest,
                errorsMessages: [{ field: 'code', message: 'Email already confirmed' }],
            };
        }

        if (Date.now() > user.emailConfirmation.expirationDate.getTime()) {
            return {
                data: null,
                status: ResultStatus.BadRequest,
                errorsMessages: [{ field: 'code', message: 'Code expired' }],
            };
        }

        const result = await usersRepository.updateUserEmailConfirmation(user._id.toString(), true);

        if (!result.acknowledged) {
            return {
                data: null,
                status: ResultStatus.Failure,
                errorsMessages: [{ field: '', message: 'Data update failed' }],
            };
        }

        return { data: null, status: ResultStatus.Success };
    },
    async registrationEmailResending(email: string): Promise<Result<SMTPTransport.SentMessageInfo | null>> {
        const user = await usersRepository.findUserByEmail(email);

        if (!user) {
            return {
                data: null,
                status: ResultStatus.BadRequest,
                errorsMessages: [{ field: 'email', message: 'User with this email not found' }],
            };
        }

        if (user.emailConfirmation.isConfirmed) {
            return {
                data: null,
                status: ResultStatus.BadRequest,
                errorsMessages: [{ field: 'email', message: 'Email already confirmed' }],
            };
        }

        const { data, status, errorsMessages } = await emailManager.sendPasswordConfirmationEmail(
            email,
            user.emailConfirmation.confirmationCode
        );

        if (!data || data.accepted.length === 0) {
            return { data: null, status, errorsMessages };
        }

        return { data, status: ResultStatus.Success };
    },
};
