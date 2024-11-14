import { postRepository } from '../../repositories';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';

export const getAllPostsHandler = (req: Request, res: Response) => {
    const allPosts = postRepository.findAllPosts();

    res.status(HTTP_STATUS_CODES.OK_200).send(allPosts);
};
