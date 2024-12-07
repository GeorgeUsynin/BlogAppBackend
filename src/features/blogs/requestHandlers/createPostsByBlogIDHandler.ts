import { Response } from 'express';
import { RequestWithParamsAndBody } from '../../shared/types';
import { URIParamsBlogIDModel } from '../models';
import { CreateUpdatePostInputModel, PostItemViewModel } from '../../posts/models';
import { postsService } from '../../posts/domain';
import { HTTP_STATUS_CODES } from '../../../constants';
import { queryPostsRepository } from '../../posts/repository';

export const createPostsByBlogIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsBlogIDModel, CreateUpdatePostInputModel>,
    res: Response<PostItemViewModel>
) => {
    const blogId = req.params.id;
    const payload = req.body;

    const result = await postsService.createPostByBlogId(payload, blogId);

    if (!result) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    const newPost = await queryPostsRepository.getPostById(result.insertedId.toString());

    if (!newPost) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
        return;
    }

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newPost);
};
