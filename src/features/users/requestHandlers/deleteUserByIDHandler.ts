import { usersService } from '../domain';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsUserIDModel } from '../models';

export const deleteUserByIDHandler = async (req: Request<URIParamsUserIDModel>, res: Response) => {
    const userId = req.params.id;

    const foundUser = await usersService.deleteUserById(userId);

    if (!foundUser) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
