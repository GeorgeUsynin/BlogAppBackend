import { NextFunction, Request, Response } from 'express';
import { AuthMeViewModel } from '../models';
import { queryUsersRepository } from '../../users/repository';
import { HTTP_STATUS_CODES } from '../../../constants';

export const meHandler = async (req: Request, res: Response<AuthMeViewModel>, next: NextFunction) => {
    try {
        const userId = req.userId;

        const user = await queryUsersRepository.getUserInfoById(userId as string);

        res.status(HTTP_STATUS_CODES.OK_200).send(user);
    } catch (err) {
        next(err);
    }
};
