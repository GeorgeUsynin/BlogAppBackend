import { NextFunction, Response } from 'express';
import { ErrorViewModel, RequestWithBody } from '../../shared/types';
import { PasswordRecoveryInputModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../constants';
import { passwordService } from '../domain';

export const passwordRecoveryHandler = async (
    req: RequestWithBody<PasswordRecoveryInputModel>,
    res: Response<ErrorViewModel>,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        await passwordService.recoverPassword(email);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
