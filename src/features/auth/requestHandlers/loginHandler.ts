import { Response } from 'express';
import { RequestWithBody } from '../../shared/types';
import { LoginInputModel, LoginViewModel } from '../models';
import { usersService } from '../../users/domain';
import { HTTP_STATUS_CODES, ResultStatus } from '../../../constants';

export const loginHandler = async (req: RequestWithBody<LoginInputModel>, res: Response<LoginViewModel>) => {
    const { loginOrEmail, password } = req.body;

    const { data, status } = await usersService.login(loginOrEmail, password);

    if (!data) {
        if (status === ResultStatus.Unauthorized) {
            res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        } else {
            res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
        }
        return;
    }

    const { accessToken, refreshToken } = data;

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken });
};
