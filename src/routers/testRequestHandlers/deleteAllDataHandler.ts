import { testRepository } from '../../repositories';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';

export const deleteAllDataHandler = (req: Request, res: Response) => {
    testRepository.deleteAllData();
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
