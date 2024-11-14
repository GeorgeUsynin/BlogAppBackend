import { blogRepository, postRepository } from '../../repositories';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import type { RequestWithBody } from '../../types';
import type { CreateUpdatePostInputModel, PostViewModel } from '../../models/posts';

export const createPostHandler = (req: RequestWithBody<CreateUpdatePostInputModel>, res: Response<PostViewModel>) => {
    const payload = req.body;
    const linkedBlogName = blogRepository.findBlogById(payload.blogId)?.name as string;

    const newPost = postRepository.mapRequestedPayloadToViewModel(linkedBlogName, payload);
    postRepository.addPost(newPost);

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newPost);
};
