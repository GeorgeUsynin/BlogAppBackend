import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithParamsAndQueries } from '../../shared/types';
import { URIParamsBlogIDModel } from '../models';
import { PostsPaginatedViewModel, QueryParamsPostModel } from '../../posts/models';
import { queryPostsRepository } from '../../posts/repository';

export const getAllPostsByBlogIDHandler = async (
    req: RequestWithParamsAndQueries<URIParamsBlogIDModel, QueryParamsPostModel>,
    res: Response<PostsPaginatedViewModel>
) => {
    const blogId = req.params.id;
    const queryParams = req.query;

    const allPosts = await queryPostsRepository.getAllPostsByBlogId(queryParams, blogId);

    if (!allPosts) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.status(HTTP_STATUS_CODES.OK_200).send(allPosts);
};
