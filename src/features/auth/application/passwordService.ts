import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import { add } from 'date-fns';
import { UsersRepository } from '../../users/infrastructure';
import { randomUUID } from 'crypto';
import { SETTINGS } from '../../../app-settings';
import { EmailManager } from '../../shared/application/managers/emailManager';
import { APIError } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';

@injectable()
export class PasswordService {
    constructor(
        @inject(UsersRepository) private usersRepository: UsersRepository,
        @inject(EmailManager) private emailManager: EmailManager
    ) {}

    async recoverPassword(email: string) {
        const user = await this.usersRepository.findUserByEmail(email);

        if (!user) return;

        user.generatePasswordRecoveryCode();
        const passwordRecoveryCode = user.passwordRecovery.recoveryCode!;
        await this.usersRepository.save(user);

        // sent confirmation email
        this.emailManager.sendPasswordRecoveryEmail(email, passwordRecoveryCode);
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

        if (user.canChangePassword(recoveryCode)) {
            const passwordHash = await bcrypt.hash(newPassword, SETTINGS.HASH_ROUNDS);

            user.changePassword(recoveryCode, passwordHash);

            await this.usersRepository.save(user);
        }
    }
}
