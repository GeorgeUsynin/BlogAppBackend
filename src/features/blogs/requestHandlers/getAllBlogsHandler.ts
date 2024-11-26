import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithQueryParams } from '../../shared/types';
import { BlogsPaginatedViewModel, QueryParamsBlogModel } from '../models';
import { queryBlogsRepository } from '../repository';

export const getAllBlogsHandler = async (
    req: RequestWithQueryParams<QueryParamsBlogModel>,
    res: Response<BlogsPaginatedViewModel>
) => {
    const queryParams = req.query;
    const allBlogs = await queryBlogsRepository.findAllBlogs(queryParams);

    res.status(HTTP_STATUS_CODES.OK_200).send(allBlogs);
};
