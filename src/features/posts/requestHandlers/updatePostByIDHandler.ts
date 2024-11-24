import { postsService } from '../domain';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithParamsAndBody } from '../../../types';
import type { CreateUpdatePostInputModel, URIParamsPostIDModel } from '../models';

export const updatePostByIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsPostIDModel, CreateUpdatePostInputModel>,
    res: Response
) => {
    const postId = req.params.id;
    const payload = req.body;

    const foundPost = await postsService.updatePost(postId, payload);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
