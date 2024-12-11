import { usersService } from '../domain';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES, ResultStatus } from '../../../constants';
import type { URIParamsUserIDModel } from '../models';

export const deleteUserByIDHandler = async (req: Request<URIParamsUserIDModel>, res: Response) => {
    const userId = req.params.id;

    const { data, status } = await usersService.deleteUserById(userId);

    if (!data) {
        if (status === ResultStatus.NotFound) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        } else {
            res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
        }
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
