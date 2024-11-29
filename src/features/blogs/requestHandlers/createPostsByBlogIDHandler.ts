import { Response } from 'express';
import { RequestWithParamsAndBody } from '../../shared/types';
import { URIParamsBlogIDPostModel } from '../models';
import { CreateUpdatePostInputModel, PostItemViewModel } from '../../posts/models';
import { blogsService } from '../domain';
import { HTTP_STATUS_CODES } from '../../../constants';
import { queryBlogsRepository } from '../repository';
import { queryPostsRepository } from '../../posts/repository';

export const createPostsByBlogIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsBlogIDPostModel, CreateUpdatePostInputModel>,
    res: Response<PostItemViewModel>
) => {
    const blogId = req.params.id;
    const payload = req.body;

    const blog = await queryBlogsRepository.getBlogById(blogId);

    if (!blog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    const { insertedId } = await blogsService.createPostByBlogId(payload, blogId);
    const newPost = await queryPostsRepository.getPostById(insertedId.toString());

    if (!newPost) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
        return;
    }

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newPost);
};
