import { testRepository } from '../repository';
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';

export const deleteAllDataHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await testRepository.deleteAllData();
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
