import { Response } from 'express';
import type { RequestWithQueryParams } from '../../shared/types';
import { QueryParamsPostModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../constants';
import { queryPostsRepository } from '../repository';

export const getAllPostsHandler = async (req: RequestWithQueryParams<QueryParamsPostModel>, res: Response) => {
    const queryParams = req.query;
    const allPosts = await queryPostsRepository.findAllPosts(queryParams);

    res.status(HTTP_STATUS_CODES.OK_200).send(allPosts);
};
