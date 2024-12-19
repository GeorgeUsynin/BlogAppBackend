import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithQueryParams } from '../../shared/types';
import { UsersPaginatedViewModel, QueryParamsUserModel } from '../models';
import { queryUsersRepository } from '../repository';

export const getAllUsersHandler = async (
    req: RequestWithQueryParams<QueryParamsUserModel>,
    res: Response<UsersPaginatedViewModel>,
    next: NextFunction
) => {
    try {
        const queryParams = req.query;

        const allUsers = await queryUsersRepository.getAllUsers(queryParams);

        res.status(HTTP_STATUS_CODES.OK_200).send(allUsers);
    } catch (err) {
        next(err);
    }
};
