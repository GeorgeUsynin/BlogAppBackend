import { postsService } from '../domain';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithBody } from '../../../types';
import type { CreateUpdatePostInputModel, PostItemViewModel } from '../models';

export const createPostHandler = async (
    req: RequestWithBody<CreateUpdatePostInputModel>,
    res: Response<PostItemViewModel>
) => {
    const payload = req.body;

    const newPost = await postsService.createPost(payload);

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newPost);
};
