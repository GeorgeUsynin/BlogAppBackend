import { blogsService } from '../domain';
import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithBody } from '../../shared/types';
import type { CreateUpdateBlogInputModel, BlogItemViewModel } from '../models';
import { queryBlogsRepository } from '../repository';

export const createBlogHandler = async (
    req: RequestWithBody<CreateUpdateBlogInputModel>,
    res: Response<BlogItemViewModel>,
    next: NextFunction
) => {
    try {
        const payload = req.body;

        const { id } = await blogsService.createBlog(payload);

        const newBlog = await queryBlogsRepository.getBlogById(id);

        res.status(HTTP_STATUS_CODES.CREATED_201).send(newBlog);
    } catch (err) {
        next(err);
    }
};
