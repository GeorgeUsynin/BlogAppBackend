import { Response } from 'express';
import { RequestWithBody } from '../../shared/types';
import { LoginInputModel } from '../models';
import { authService } from '../domain';
import { HTTP_STATUS_CODES } from '../../../constants';

export const loginHandler = async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const { loginOrEmail, password } = req.body;

    const user = await authService.login(loginOrEmail, password);

    if (!user) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
