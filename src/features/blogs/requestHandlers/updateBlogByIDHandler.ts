import { blogsService } from '../domain';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithParamsAndBody } from '../../../types';
import type { CreateUpdateBlogInputModel, URIParamsBlogIDModel } from '../models';

export const updateBlogByIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsBlogIDModel, CreateUpdateBlogInputModel>,
    res: Response
) => {
    const blogId = req.params.id;
    const payload = req.body;

    const foundBlog = await blogsService.updateBlog(blogId, payload);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
