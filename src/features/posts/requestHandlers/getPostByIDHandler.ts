import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsPostIDModel, PostItemViewModel } from '../models';
import { queryPostsRepository } from '../repository';

export const getPostByIDHandler = async (req: Request<URIParamsPostIDModel>, res: Response<PostItemViewModel>) => {
    const postId = req.params.id;

    const foundPost = await queryPostsRepository.getPostById(postId);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.send(foundPost);
};
