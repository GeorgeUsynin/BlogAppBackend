import { postRepository } from '../../repositories';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import type { URIParamsPostIDModel } from '../../models/posts';

export const deletePostByID = (req: Request<URIParamsPostIDModel>, res: Response) => {
    const postId = req.params.id;

    const foundPost = postRepository.findPostById(postId);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    postRepository.deletePostById(postId);
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
