import { blogRepository } from '../../repositories';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import type { URIParamsBlogIDModel } from '../../models/blogs';

export const deleteBlogByID = (req: Request<URIParamsBlogIDModel>, res: Response) => {
    const blogId = req.params.id;

    const foundBlog = blogRepository.findBlogById(blogId);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    blogRepository.deleteBlogById(blogId);
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
