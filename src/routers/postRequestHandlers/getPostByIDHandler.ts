import { postRepository } from '../../repositories';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import type { URIParamsPostIDModel, PostViewModel } from '../../models/posts';

export const getPostByIDHandler = (req: Request<URIParamsPostIDModel>, res: Response<PostViewModel>) => {
    const postId = req.params.id;

    const foundPost = postRepository.findPostById(postId);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.send(foundPost);
};
