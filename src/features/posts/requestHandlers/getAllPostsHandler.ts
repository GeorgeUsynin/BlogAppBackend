import { postsService } from '../domain';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';

export const getAllPostsHandler = async (req: Request, res: Response) => {
    const allPosts = await postsService.findAllPosts();

    res.status(HTTP_STATUS_CODES.OK_200).send(allPosts);
};
