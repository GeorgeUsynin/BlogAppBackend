import { blogRepository } from '../../repositories';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import type { RequestWithParamsAndBody } from '../../types';
import type { CreateUpdateBlogInputModel, URIParamsBlogIDModel } from '../../models/blogs';

export const updateBlogByIDHandler = (
    req: RequestWithParamsAndBody<URIParamsBlogIDModel, CreateUpdateBlogInputModel>,
    res: Response
) => {
    const blogId = req.params.id;
    const payload = req.body;

    const foundBlog = blogRepository.findBlogById(blogId);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    blogRepository.updateBlog(foundBlog, payload);
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
