import { blogsService } from '../domain';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';

export const getAllBlogsHandler = async (req: Request, res: Response) => {
    const allBlogs = await blogsService.findAllBlogs();

    res.status(HTTP_STATUS_CODES.OK_200).send(allBlogs);
};
