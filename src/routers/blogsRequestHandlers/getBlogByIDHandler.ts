import { blogRepository } from '../../repositories';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import type { URIParamsBlogIDModel, BlogViewModel } from '../../models/blogs';

export const getBlogByIDHandler = (req: Request<URIParamsBlogIDModel>, res: Response<BlogViewModel>) => {
    const blogId = req.params.id;

    const foundBlog = blogRepository.findBlogById(blogId);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.send(foundBlog);
};
