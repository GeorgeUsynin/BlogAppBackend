import { Response } from 'express';
import { RequestWithBody } from '../../shared/types';
import { LoginInputModel, LoginViewModel } from '../models';
import { usersService } from '../../users/domain';
import { HTTP_STATUS_CODES } from '../../../constants';

export const loginHandler = async (req: RequestWithBody<LoginInputModel>, res: Response<LoginViewModel>) => {
    const { loginOrEmail, password } = req.body;

    const token = await usersService.login(loginOrEmail, password);

    if (!token) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    res.status(HTTP_STATUS_CODES.OK_200).send(token);
};
