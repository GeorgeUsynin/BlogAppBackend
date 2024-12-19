import { NextFunction, Request, Response } from 'express';
import type { URIParamsPostIDModel, PostItemViewModel } from '../models';
import { queryPostsRepository } from '../repository';

export const getPostByIDHandler = async (
    req: Request<URIParamsPostIDModel>,
    res: Response<PostItemViewModel>,
    next: NextFunction
) => {
    try {
        const postId = req.params.id;

        const foundPost = await queryPostsRepository.getPostById(postId);

        res.send(foundPost);
    } catch (err) {
        next(err);
    }
};
