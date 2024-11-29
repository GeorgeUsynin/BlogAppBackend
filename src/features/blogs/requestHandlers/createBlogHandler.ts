import { blogsService } from '../domain';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithBody } from '../../shared/types';
import type { CreateUpdateBlogInputModel, BlogItemViewModel } from '../models';
import { queryBlogsRepository } from '../repository';

export const createBlogHandler = async (
    req: RequestWithBody<CreateUpdateBlogInputModel>,
    res: Response<BlogItemViewModel>
) => {
    const payload = req.body;

    const { insertedId } = await blogsService.createBlog(payload);
    const newBlog = await queryBlogsRepository.getBlogById(insertedId.toString());

    if (!newBlog) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
        return;
    }

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newBlog);
};
