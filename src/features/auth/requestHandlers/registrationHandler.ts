import { Response } from 'express';
import { ErrorViewModel, RequestWithBody } from '../../shared/types';
import { RegistrationInputModel } from '../models';
import { registrationService } from '../domain';
import { HTTP_STATUS_CODES, ResultStatus } from '../../../constants';

export const registrationHandler = async (
    req: RequestWithBody<RegistrationInputModel>,
    res: Response<ErrorViewModel>
) => {
    const payload = req.body;
    const { data, status, errorsMessages } = await registrationService.registerUser(payload);

    if (status === ResultStatus.BadRequest && errorsMessages) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).send({ errorsMessages });
        return;
    } else if (status === ResultStatus.Failure && errorsMessages) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500).send({ errorsMessages });
        return;
    } else if (status === ResultStatus.Success) {
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
};
