import { blogsService } from '../domain';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithBody } from '../../../types';
import type { CreateUpdateBlogInputModel, BlogItemViewModel } from '../models';

export const createBlogHandler = async (
    req: RequestWithBody<CreateUpdateBlogInputModel>,
    res: Response<BlogItemViewModel>
) => {
    const payload = req.body;

    const newBlog = await blogsService.createBlog(payload);

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newBlog);
};
