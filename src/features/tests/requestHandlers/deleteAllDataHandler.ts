import { testRepository } from '../repository';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';

export const deleteAllDataHandler = async (req: Request, res: Response) => {
    await testRepository.deleteAllData();
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
