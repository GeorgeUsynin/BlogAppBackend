import { postsRepository } from '../repository';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithParamsAndBody } from '../../../types';
import type { CreateUpdatePostInputModel, URIParamsPostIDModel } from '../models';

export const updatePostByIDHandler = (
    req: RequestWithParamsAndBody<URIParamsPostIDModel, CreateUpdatePostInputModel>,
    res: Response
) => {
    const postId = req.params.id;
    const payload = req.body;

    const foundPost = postsRepository.findPostById(postId);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    postsRepository.updatePost(foundPost, payload);
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
