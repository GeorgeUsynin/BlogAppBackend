import { blogsRepository } from '../repository';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithParamsAndBody } from '../../../types';
import type { CreateUpdateBlogInputModel, URIParamsBlogIDModel } from '../models';

export const updateBlogByIDHandler = (
    req: RequestWithParamsAndBody<URIParamsBlogIDModel, CreateUpdateBlogInputModel>,
    res: Response
) => {
    const blogId = req.params.id;
    const payload = req.body;

    const foundBlog = blogsRepository.findBlogById(blogId);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    blogsRepository.updateBlog(foundBlog, payload);
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
