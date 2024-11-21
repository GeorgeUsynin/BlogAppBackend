import { postsRepository } from '../repository';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsPostIDModel } from '../models';
import { ObjectId } from 'mongodb';

export const deletePostByID = async (req: Request<URIParamsPostIDModel>, res: Response) => {
    const postId = new ObjectId(req.params.id);

    const foundPost = await postsRepository.deletePostById(postId);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
