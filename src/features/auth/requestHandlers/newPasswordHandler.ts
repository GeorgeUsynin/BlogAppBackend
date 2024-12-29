import { NextFunction, Response } from 'express';
import { ErrorViewModel, RequestWithBody } from '../../shared/types';
import { NewPasswordInputModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../constants';
import { passwordService } from '../domain';

export const newPasswordHandler = async (
    req: RequestWithBody<NewPasswordInputModel>,
    res: Response<ErrorViewModel>,
    next: NextFunction
) => {
    try {
        const { newPassword, recoveryCode } = req.body;

        await passwordService.changePassword(newPassword, recoveryCode);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
