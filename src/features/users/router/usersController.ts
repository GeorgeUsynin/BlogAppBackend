import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { ErrorViewModel, RequestWithBody, RequestWithQueryParams } from '../../shared/types';
import {
    UsersPaginatedViewModel,
    QueryParamsUserModel,
    CreateUserInputModel,
    UserItemViewModel,
    URIParamsUserIDModel,
} from '../models';
import { UsersService } from '../domain';
import { QueryUsersRepository } from '../repository';

export class UsersController {
    constructor(private usersService: UsersService, private queryUsersRepository: QueryUsersRepository) {}

    async getAllUsers(
        req: RequestWithQueryParams<QueryParamsUserModel>,
        res: Response<UsersPaginatedViewModel>,
        next: NextFunction
    ) {
        try {
            const queryParams = req.query;

            const allUsers = await this.queryUsersRepository.getAllUsers(queryParams);

            res.status(HTTP_STATUS_CODES.OK_200).send(allUsers);
        } catch (err) {
            next(err);
        }
    }

    async createUser(
        req: RequestWithBody<CreateUserInputModel>,
        res: Response<UserItemViewModel | ErrorViewModel>,
        next: NextFunction
    ) {
        try {
            const payload = req.body;

            const { id } = await this.usersService.createUser(payload);

            const newUser = await this.queryUsersRepository.getUserById(id);

            res.status(HTTP_STATUS_CODES.CREATED_201).send(newUser);
        } catch (err) {
            next(err);
        }
    }

    async deleteUserByID(req: Request<URIParamsUserIDModel>, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;

            await this.usersService.deleteUserById(userId);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }
}
