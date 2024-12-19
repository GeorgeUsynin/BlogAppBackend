import { NextFunction, Response } from 'express';
import { RequestWithBody } from '../../shared/types';
import { LoginInputModel, LoginViewModel } from '../models';
import { usersService } from '../../users/domain';
import { HTTP_STATUS_CODES } from '../../../constants';

export const loginHandler = async (
    req: RequestWithBody<LoginInputModel>,
    res: Response<LoginViewModel>,
    next: NextFunction
) => {
    try {
        const { loginOrEmail, password } = req.body;

        const { accessToken, refreshToken } = await usersService.login(loginOrEmail, password);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

        res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken });
    } catch (err) {
        next(err);
    }
};
