import { blogsRepository } from '../repository';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsBlogIDModel, BlogViewModel } from '../models';

export const getBlogByIDHandler = (req: Request<URIParamsBlogIDModel>, res: Response<BlogViewModel>) => {
    const blogId = req.params.id;

    const foundBlog = blogsRepository.findBlogById(blogId);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.send(foundBlog);
};
