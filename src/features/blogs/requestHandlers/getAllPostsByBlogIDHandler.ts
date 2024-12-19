import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithParamsAndQueries } from '../../shared/types';
import { URIParamsBlogIDModel } from '../models';
import { PostsPaginatedViewModel, QueryParamsPostModel } from '../../posts/models';
import { queryPostsRepository } from '../../posts/repository';

export const getAllPostsByBlogIDHandler = async (
    req: RequestWithParamsAndQueries<URIParamsBlogIDModel, QueryParamsPostModel>,
    res: Response<PostsPaginatedViewModel>,
    next: NextFunction
) => {
    try {
        const blogId = req.params.id;
        const queryParams = req.query;

        const allPosts = await queryPostsRepository.getAllPostsByBlogId(queryParams, blogId);

        res.status(HTTP_STATUS_CODES.OK_200).send(allPosts);
    } catch (err) {
        next(err);
    }
};
