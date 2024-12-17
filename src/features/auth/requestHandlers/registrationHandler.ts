import { NextFunction, Response } from 'express';
import { ErrorViewModel, RequestWithBody } from '../../shared/types';
import { RegistrationInputModel } from '../models';
import { registrationService } from '../domain';
import { HTTP_STATUS_CODES } from '../../../constants';

export const registrationHandler = async (
    req: RequestWithBody<RegistrationInputModel>,
    res: Response<ErrorViewModel>,
    next: NextFunction
) => {
    try {
        const payload = req.body;

        await registrationService.registerUser(payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
