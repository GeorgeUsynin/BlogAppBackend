import { usersService } from '../domain';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithBody, ErrorViewModel } from '../../shared/types';
import type { CreateUserInputModel, UserItemViewModel } from '../models';
import { queryUsersRepository } from '../repository';

export const createUserHandler = async (
    req: RequestWithBody<CreateUserInputModel>,
    res: Response<UserItemViewModel | ErrorViewModel>
) => {
    const payload = req.body;

    const result = await usersService.createUser(payload);

    if ('errorsMessages' in result) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).send(result);
        return;
    }

    const newUser = await queryUsersRepository.getUserById(result.insertedId.toString());

    if (!newUser) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
        return;
    }

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newUser);
};
