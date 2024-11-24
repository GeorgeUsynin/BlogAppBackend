import { blogsService } from '../domain';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsBlogIDModel } from '../models';

export const deleteBlogByID = async (req: Request<URIParamsBlogIDModel>, res: Response) => {
    const blogId = req.params.id;

    const foundBlog = await blogsService.deleteBlogById(blogId);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
