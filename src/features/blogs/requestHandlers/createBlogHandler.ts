import { blogsRepository } from '../repository';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithBody } from '../../../types';
import type { CreateUpdateBlogInputModel, BlogViewModel } from '../models';

export const createBlogHandler = (req: RequestWithBody<CreateUpdateBlogInputModel>, res: Response<BlogViewModel>) => {
    const payload = req.body;
    const newBlog = blogsRepository.mapRequestedPayloadToViewModel(payload);
    blogsRepository.addBlog(newBlog);

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newBlog);
};
