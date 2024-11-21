import { postsRepository } from '../repository';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsPostIDModel, PostViewModel } from '../models';
import { ObjectId } from 'mongodb';

export const getPostByIDHandler = async (req: Request<URIParamsPostIDModel>, res: Response<PostViewModel>) => {
    const postId = new ObjectId(req.params.id);

    const foundPost = await postsRepository.findPostById(postId);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.send(foundPost);
};
