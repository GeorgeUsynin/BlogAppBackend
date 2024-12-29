import { usersService } from '../domain';
import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithBody, ErrorViewModel } from '../../shared/types';
import type { CreateUserInputModel, UserItemViewModel } from '../models';
import { queryUsersRepository } from '../repository';

export const createUserHandler = async (
    req: RequestWithBody<CreateUserInputModel>,
    res: Response<UserItemViewModel | ErrorViewModel>,
    next: NextFunction
) => {
    try {
        const payload = req.body;

        const { id } = await usersService.createUser(payload);

        const newUser = await queryUsersRepository.getUserById(id);

        res.status(HTTP_STATUS_CODES.CREATED_201).send(newUser);
    } catch (err) {
        next(err);
    }
};
