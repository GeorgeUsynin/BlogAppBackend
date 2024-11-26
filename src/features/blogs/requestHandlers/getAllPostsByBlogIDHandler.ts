import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithParamsAndQueries } from '../../shared/types';
import { URIParamsBlogIDPostModel } from '../models';
import { PostsPaginatedViewModel, QueryParamsPostModel } from '../../posts/models';
import { queryPostsRepository } from '../../posts/repository';

export const getAllPostsByBlogIDHandler = async (
    req: RequestWithParamsAndQueries<URIParamsBlogIDPostModel, QueryParamsPostModel>,
    res: Response<PostsPaginatedViewModel>
) => {
    const blogId = req.params.blogId;
    const queryParams = req.query;
    const allPosts = await queryPostsRepository.findAllPosts(queryParams, blogId);

    res.status(HTTP_STATUS_CODES.OK_200).send(allPosts);
};
