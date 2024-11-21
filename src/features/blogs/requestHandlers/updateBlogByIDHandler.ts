import { blogsRepository } from '../repository';
import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithParamsAndBody } from '../../../types';
import type { CreateUpdateBlogInputModel, URIParamsBlogIDModel } from '../models';
import { ObjectId } from 'mongodb';

export const updateBlogByIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsBlogIDModel, CreateUpdateBlogInputModel>,
    res: Response
) => {
    const blogId = new ObjectId(req.params.id);
    const payload = req.body;

    const foundBlog = await blogsRepository.updateBlog(blogId, payload);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
