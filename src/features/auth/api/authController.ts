import { inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { ErrorViewModel, RequestWithBody } from '../../shared/types';
import { AuthMeViewModel, LoginViewModel, RefreshTokenViewModel } from './models';
import { HTTP_STATUS_CODES } from '../../../constants';
import {
    AuthService,
    LoginInputDTO,
    NewPasswordInputDTO,
    PasswordRecoveryInputDTO,
    PasswordService,
    RegistrationConfirmationInputDTO,
    RegistrationEmailResendingInputDTO,
    RegistrationInputDTO,
    RegistrationService,
} from '../application';
import { QueryUsersRepository } from '../../users/infrastructure';

export class AuthController {
    constructor(
        @inject(AuthService) private authService: AuthService,
        @inject(RegistrationService) private registrationService: RegistrationService,
        @inject(PasswordService) private passwordService: PasswordService,
        @inject(QueryUsersRepository) private queryUsersRepository: QueryUsersRepository
    ) {}

    async login(req: RequestWithBody<LoginInputDTO>, res: Response<LoginViewModel>, next: NextFunction) {
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

    async registration(req: RequestWithBody<RegistrationInputDTO>, res: Response<ErrorViewModel>, next: NextFunction) {
        try {
            const payload = req.body;

            await this.registrationService.registerUser(payload);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }

    async registrationConfirmation(
        req: RequestWithBody<RegistrationConfirmationInputDTO>,
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
        req: RequestWithBody<RegistrationEmailResendingInputDTO>,
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
        req: RequestWithBody<PasswordRecoveryInputDTO>,
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

    async newPassword(req: RequestWithBody<NewPasswordInputDTO>, res: Response<ErrorViewModel>, next: NextFunction) {
        try {
            const { newPassword, recoveryCode } = req.body;

            await this.passwordService.changePassword(newPassword, recoveryCode);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }
}
