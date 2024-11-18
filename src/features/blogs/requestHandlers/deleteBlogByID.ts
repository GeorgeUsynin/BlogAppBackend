import { blogsRepository } from '../repository';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsBlogIDModel } from '../models';

export const deleteBlogByID = (req: Request<URIParamsBlogIDModel>, res: Response) => {
    const blogId = req.params.id;

    const foundBlog = blogsRepository.findBlogById(blogId);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    blogsRepository.deleteBlogById(blogId);
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
