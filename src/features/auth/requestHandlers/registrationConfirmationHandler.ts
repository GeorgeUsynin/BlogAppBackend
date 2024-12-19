import { NextFunction, Response } from 'express';
import { ErrorViewModel, RequestWithBody } from '../../shared/types';
import { RegistrationConfirmationInputModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../constants';
import { registrationService } from '../domain';

export const registrationConfirmationHandler = async (
    req: RequestWithBody<RegistrationConfirmationInputModel>,
    res: Response<ErrorViewModel>,
    next: NextFunction
) => {
    try {
        const { code } = req.body;

        await registrationService.registrationConfirmation(code);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
