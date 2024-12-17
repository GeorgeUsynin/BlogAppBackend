import { NextFunction, Response } from 'express';
import { ErrorViewModel, RequestWithBody } from '../../shared/types';
import { RegistrationEmailResendingInputModel } from '../models';
import { HTTP_STATUS_CODES, ResultStatus } from '../../../constants';
import { registrationService } from '../domain';

export const registrationEmailResendingHandler = async (
    req: RequestWithBody<RegistrationEmailResendingInputModel>,
    res: Response<ErrorViewModel>,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        await registrationService.registrationEmailResending(email);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
