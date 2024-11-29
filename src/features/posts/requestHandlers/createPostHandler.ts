import { postsService } from '../domain';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithBody } from '../../shared/types';
import type { CreateUpdatePostInputModel, PostItemViewModel } from '../models';
import { queryPostsRepository } from '../repository';

export const createPostHandler = async (
    req: RequestWithBody<CreateUpdatePostInputModel>,
    res: Response<PostItemViewModel>
) => {
    const payload = req.body;

    const { insertedId } = await postsService.createPost(payload);
    const newPost = await queryPostsRepository.getPostById(insertedId.toString());

    if (!newPost) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
        return;
    }

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newPost);
};
