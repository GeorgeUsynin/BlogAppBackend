import { blogsRepository } from '../repository';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';

export const getAllBlogsHandler = (req: Request, res: Response) => {
    const allBlogs = blogsRepository.findAllBlogs();

    res.status(HTTP_STATUS_CODES.OK_200).send(allBlogs);
};
