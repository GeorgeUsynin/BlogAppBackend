import { postsRepository } from '../repository';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsPostIDModel } from '../models';

export const deletePostByID = (req: Request<URIParamsPostIDModel>, res: Response) => {
    const postId = req.params.id;

    const foundPost = postsRepository.findPostById(postId);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    postsRepository.deletePostById(postId);
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
