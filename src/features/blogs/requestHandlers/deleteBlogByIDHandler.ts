import { blogsService } from '../domain';
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsBlogIDModel } from '../models';

export const deleteBlogByIDHandler = async (req: Request<URIParamsBlogIDModel>, res: Response, next: NextFunction) => {
    try {
        const blogId = req.params.id;

        await blogsService.deleteBlogById(blogId);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
