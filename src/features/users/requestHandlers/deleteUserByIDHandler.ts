import { usersService } from '../domain';
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsUserIDModel } from '../models';

export const deleteUserByIDHandler = async (req: Request<URIParamsUserIDModel>, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;

        await usersService.deleteUserById(userId);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
