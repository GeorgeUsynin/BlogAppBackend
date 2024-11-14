import { postRepository } from '../../repositories';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import type { RequestWithParamsAndBody } from '../../types';
import type { CreateUpdatePostInputModel, URIParamsPostIDModel } from '../../models/posts';

export const updatePostByIDHandler = (
    req: RequestWithParamsAndBody<URIParamsPostIDModel, CreateUpdatePostInputModel>,
    res: Response
) => {
    const postId = req.params.id;
    const payload = req.body;

    const foundPost = postRepository.findPostById(postId);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    postRepository.updatePost(foundPost, payload);
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
