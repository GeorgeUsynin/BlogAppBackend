import { NextFunction, Response } from 'express';
import { RequestWithBody } from '../../shared/types';
import { LoginInputModel, LoginViewModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../constants';
import { authService } from '../domain';

export const loginHandler = async (
    req: RequestWithBody<LoginInputModel>,
    res: Response<LoginViewModel>,
    next: NextFunction
) => {
    try {
        const userAgent = req.header('user-agent');
        const clientIp = req.ip || '';
        const { loginOrEmail, password } = req.body;

        const { accessToken, refreshToken } = await authService.login({ clientIp, loginOrEmail, password, userAgent });

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

        res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken });
    } catch (err) {
        next(err);
    }
};
