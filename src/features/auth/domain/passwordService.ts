import bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { usersRepository } from '../../users/repository';
import { randomUUID } from 'crypto';
import { SETTINGS } from '../../../app-settings';
import { emailManager } from '../../shared/managers';
import { APIError } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';

export const passwordService = {
    async recoverPassword(email: string) {
        const user = await usersRepository.findUserByEmail(email);

        if (!user) return;

        const recoveryCode = randomUUID();
        const expirationDate = add(new Date(), { hours: SETTINGS.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS });

        await usersRepository.updateUserRecoveryPasswordCode(user.id, recoveryCode, expirationDate);

        // sent confirmation email
        emailManager.sendPasswordRecoveryEmail(email, recoveryCode);
    },
    async changePassword(newPassword: string, recoveryCode: string) {
        const user = await usersRepository.findUserByRecoveryPasswordCode(recoveryCode);

        if (!user) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: 'recoveryCode',
                message: 'Invalid code',
            });
        }

        if (Date.now() > user.passwordRecovery.expirationDate!.getTime()) {
            throw new APIError({
                status: ResultStatus.BadRequest,
                field: 'recoveryCode',
                message: 'Code expired',
            });
        }

        // hash password
        const hash = await bcrypt.hash(newPassword, SETTINGS.HASH_ROUNDS);

        await usersRepository.updatePasswordHash(user.id, hash);
    },
};
