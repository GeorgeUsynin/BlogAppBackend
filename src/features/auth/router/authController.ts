import { NextFunction, Request, Response } from 'express';
import { ErrorViewModel, RequestWithBody } from '../../shared/types';
import {
    AuthMeViewModel,
    LoginInputModel,
    LoginViewModel,
    NewPasswordInputModel,
    PasswordRecoveryInputModel,
    RefreshTokenViewModel,
    RegistrationConfirmationInputModel,
    RegistrationEmailResendingInputModel,
    RegistrationInputModel,
} from '../models';
import { HTTP_STATUS_CODES } from '../../../constants';
import { AuthService, PasswordService, RegistrationService } from '../domain';
import { QueryUsersRepository } from '../../users/repository';

export class AuthController {
    constructor(
        private authService: AuthService,
        private registrationService: RegistrationService,
        private passwordService: PasswordService,
        private queryUsersRepository: QueryUsersRepository
    ) {}

    async login(req: RequestWithBody<LoginInputModel>, res: Response<LoginViewModel>, next: NextFunction) {
        try {
            const userAgent = req.header('user-agent');
            const clientIp = req.ip || '';
            const { loginOrEmail, password } = req.body;

            const { accessToken, refreshToken } = await this.authService.login({
                clientIp,
                loginOrEmail,
                password,
                userAgent,
            });

            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

            res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken });
        } catch (err) {
            next(err);
        }
    }

    async logout(req: Request, res: Response<ErrorViewModel>, next: NextFunction) {
        try {
            const userId = req.userId as string;
            const deviceId = req.deviceId as string;

            await this.authService.logout(userId, deviceId);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }

    async me(req: Request, res: Response<AuthMeViewModel>, next: NextFunction) {
        try {
            const userId = req.userId;

            const user = await this.queryUsersRepository.getUserInfoById(userId as string);

            res.status(HTTP_STATUS_CODES.OK_200).send(user);
        } catch (err) {
            next(err);
        }
    }

    async refreshToken(req: Request, res: Response<RefreshTokenViewModel | ErrorViewModel>, next: NextFunction) {
        try {
            const userId = req.userId as string;
            const deviceId = req.deviceId as string;

            const { newAccessToken, newRefreshToken } = await this.authService.updateTokens(userId, deviceId);

            res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

            res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken: newAccessToken });
        } catch (err) {
            next(err);
        }
    }

    async registration(
        req: RequestWithBody<RegistrationInputModel>,
        res: Response<ErrorViewModel>,
        next: NextFunction
    ) {
        try {
            const payload = req.body;

            await this.registrationService.registerUser(payload);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }

    async registrationConfirmation(
        req: RequestWithBody<RegistrationConfirmationInputModel>,
        res: Response<ErrorViewModel>,
        next: NextFunction
    ) {
        try {
            const { code } = req.body;

            await this.registrationService.registrationConfirmation(code);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }

    async registrationEmailResending(
        req: RequestWithBody<RegistrationEmailResendingInputModel>,
        res: Response<ErrorViewModel>,
        next: NextFunction
    ) {
        try {
            const { email } = req.body;

            await this.registrationService.registrationEmailResending(email);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }

    async passwordRecovery(
        req: RequestWithBody<PasswordRecoveryInputModel>,
        res: Response<ErrorViewModel>,
        next: NextFunction
    ) {
        try {
            const { email } = req.body;

            await this.passwordService.recoverPassword(email);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }

    async newPassword(req: RequestWithBody<NewPasswordInputModel>, res: Response<ErrorViewModel>, next: NextFunction) {
        try {
            const { newPassword, recoveryCode } = req.body;

            await this.passwordService.changePassword(newPassword, recoveryCode);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }
}
