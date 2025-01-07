import bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { UsersRepository } from '../../users/infrastructure';
import { randomUUID } from 'crypto';
import { SETTINGS } from '../../../app-settings';
import { EmailManager } from '../../shared/application/managers/emailManager';
import { APIError } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';

export class PasswordService {
    constructor(private usersRepository: UsersRepository, private emailManager: EmailManager) {}

    async recoverPassword(email: string) {
        const user = await this.usersRepository.findUserByEmail(email);

        if (!user) return;

        const recoveryCode = randomUUID();
        const expirationDate = add(new Date(), { hours: SETTINGS.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS });

        user.passwordRecovery.recoveryCode = recoveryCode;
        user.passwordRecovery.expirationDate = expirationDate;

        await this.usersRepository.save(user);

        // sent confirmation email
        this.emailManager.sendPasswordRecoveryEmail(email, recoveryCode);
    }

    async changePassword(newPassword: string, recoveryCode: string) {
        const user = await this.usersRepository.findUserByRecoveryPasswordCode(recoveryCode);

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

        user.passwordHash = hash;

        await this.usersRepository.save(user);
    }
}
