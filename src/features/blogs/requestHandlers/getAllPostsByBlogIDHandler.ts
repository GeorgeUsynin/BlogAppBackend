import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithParamsAndQueries } from '../../shared/types';
import { URIParamsBlogIDPostModel } from '../models';
import { PostsPaginatedViewModel, QueryParamsPostModel } from '../../posts/models';
import { queryPostsRepository } from '../../posts/repository';
import { queryBlogsRepository } from '../repository';

export const getAllPostsByBlogIDHandler = async (
    req: RequestWithParamsAndQueries<URIParamsBlogIDPostModel, QueryParamsPostModel>,
    res: Response<PostsPaginatedViewModel>
) => {
    const blogId = req.params.id;
    const queryParams = req.query;

    const blog = await queryBlogsRepository.getBlogById(blogId);

    if (!blog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    const allPosts = await queryPostsRepository.getAllPosts(queryParams, blogId);

    res.status(HTTP_STATUS_CODES.OK_200).send(allPosts);
};
