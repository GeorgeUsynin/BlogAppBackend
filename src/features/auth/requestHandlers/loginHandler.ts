import { Response } from 'express';
import { RequestWithBody } from '../../shared/types';
import { LoginInputModel, LoginViewModel } from '../models';
import { authService } from '../domain';
import { HTTP_STATUS_CODES } from '../../../constants';

export const loginHandler = async (req: RequestWithBody<LoginInputModel>, res: Response<LoginViewModel>) => {
    const { loginOrEmail, password } = req.body;

    const token = await authService.login(loginOrEmail, password);

    if (!token) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    res.status(HTTP_STATUS_CODES.OK_200).send(token);
};
