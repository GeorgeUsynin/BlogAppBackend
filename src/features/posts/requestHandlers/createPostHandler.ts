import { postsService } from '../domain';
import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithBody } from '../../shared/types';
import type { CreateUpdatePostInputModel, PostItemViewModel } from '../models';
import { queryPostsRepository } from '../repository';

export const createPostHandler = async (
    req: RequestWithBody<CreateUpdatePostInputModel>,
    res: Response<PostItemViewModel>,
    next: NextFunction
) => {
    try {
        const payload = req.body;

        const { id } = await postsService.createPost(payload);
        const newPost = await queryPostsRepository.getPostById(id);

        res.status(HTTP_STATUS_CODES.CREATED_201).send(newPost);
    } catch (err) {
        next(err);
    }
};
