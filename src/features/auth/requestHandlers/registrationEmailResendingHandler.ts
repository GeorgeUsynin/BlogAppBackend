import { Response } from 'express';
import { ErrorViewModel, RequestWithBody } from '../../shared/types';
import { RegistrationEmailResendingInputModel } from '../models';
import { HTTP_STATUS_CODES, ResultStatus } from '../../../constants';
import { registrationService } from '../domain';

export const registrationEmailResendingHandler = async (
    req: RequestWithBody<RegistrationEmailResendingInputModel>,
    res: Response<ErrorViewModel>
) => {
    const { email } = req.body;
    const { data, status, errorsMessages } = await registrationService.registrationEmailResending(email);

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
