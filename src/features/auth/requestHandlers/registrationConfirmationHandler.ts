import { Response } from 'express';
import { ErrorViewModel, RequestWithBody } from '../../shared/types';
import { RegistrationConfirmationInputModel } from '../models';
import { HTTP_STATUS_CODES, ResultStatus } from '../../../constants';
import { registrationService } from '../domain';

export const registrationConfirmationHandler = async (
    req: RequestWithBody<RegistrationConfirmationInputModel>,
    res: Response<ErrorViewModel>
) => {
    const { code } = req.body;

    const { errorsMessages, status } = await registrationService.registrationConfirmation(code);

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
