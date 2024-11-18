import { blogsRepository } from '../../blogs/repository';
import { postsRepository } from '../repository';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithBody } from '../../../types';
import type { CreateUpdatePostInputModel, PostViewModel } from '../models';

export const createPostHandler = (req: RequestWithBody<CreateUpdatePostInputModel>, res: Response<PostViewModel>) => {
    const payload = req.body;
    const linkedBlogName = blogsRepository.findBlogById(payload.blogId)?.name as string;

    const newPost = postsRepository.mapRequestedPayloadToViewModel(linkedBlogName, payload);
    postsRepository.addPost(newPost);

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newPost);
};
