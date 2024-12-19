import { NextFunction, Response } from 'express';
import { RequestWithParamsAndBody } from '../../shared/types';
import { URIParamsBlogIDModel } from '../models';
import { CreateUpdatePostInputModel, PostItemViewModel } from '../../posts/models';
import { postsService } from '../../posts/domain';
import { HTTP_STATUS_CODES } from '../../../constants';
import { queryPostsRepository } from '../../posts/repository';

export const createPostsByBlogIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsBlogIDModel, CreateUpdatePostInputModel>,
    res: Response<PostItemViewModel>,
    next: NextFunction
) => {
    try {
        const blogId = req.params.id;
        const payload = req.body;

        const result = await postsService.createPostByBlogId(payload, blogId);

        const newPost = await queryPostsRepository.getPostById(result.insertedId.toString());

        res.status(HTTP_STATUS_CODES.CREATED_201).send(newPost);
    } catch (err) {
        next(err);
    }
};
