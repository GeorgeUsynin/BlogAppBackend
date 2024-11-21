import { postsRepository } from '../repository';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithParamsAndBody } from '../../../types';
import type { CreateUpdatePostInputModel, URIParamsPostIDModel } from '../models';
import { ObjectId } from 'mongodb';

export const updatePostByIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsPostIDModel, CreateUpdatePostInputModel>,
    res: Response
) => {
    const postId = new ObjectId(req.params.id);
    const payload = req.body;

    const foundPost = await postsRepository.updatePost(postId, payload);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
