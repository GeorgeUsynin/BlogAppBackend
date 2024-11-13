import { blogRepository } from '../../repositories';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import type { RequestWithBody } from '../../types';
import type { CreateUpdateBlogInputModel, BlogViewModel } from '../../models/blogs';

export const createBlogHandler = (req: RequestWithBody<CreateUpdateBlogInputModel>, res: Response<BlogViewModel>) => {
    const payload = req.body;
    const newBlog = blogRepository.mapRequestedPayloadToViewModel(payload);
    blogRepository.addBlog(newBlog);

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newBlog);
};
