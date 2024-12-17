import { blogsService } from '../domain';
import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithParamsAndBody } from '../../shared/types';
import type { CreateUpdateBlogInputModel, URIParamsBlogIDModel } from '../models';

export const updateBlogByIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsBlogIDModel, CreateUpdateBlogInputModel>,
    res: Response,
    next: NextFunction
) => {
    try {
        const blogId = req.params.id;
        const payload = req.body;

        await blogsService.updateBlog(blogId, payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
