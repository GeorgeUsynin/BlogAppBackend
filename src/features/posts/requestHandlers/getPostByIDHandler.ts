import { postsService } from '../domain';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsPostIDModel, PostViewModel } from '../models';

export const getPostByIDHandler = async (req: Request<URIParamsPostIDModel>, res: Response<PostViewModel>) => {
    const postId = req.params.id;

    const foundPost = await postsService.findPostById(postId);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.send(foundPost);
};
