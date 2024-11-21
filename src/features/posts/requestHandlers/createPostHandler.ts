import { postsRepository } from '../repository';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithBody } from '../../../types';
import type { CreateUpdatePostInputModel, PostViewModel } from '../models';

export const createPostHandler = async (
    req: RequestWithBody<CreateUpdatePostInputModel>,
    res: Response<PostViewModel>
) => {
    const payload = req.body;

    const newPost = await postsRepository.addPost(payload);

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newPost);
};
