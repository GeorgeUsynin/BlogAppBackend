import { NextFunction, Request, Response } from 'express';
import type { URIParamsBlogIDModel, BlogItemViewModel } from '../models';
import { queryBlogsRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../../constants';

export const getBlogByIDHandler = async (
    req: Request<URIParamsBlogIDModel>,
    res: Response<BlogItemViewModel>,
    next: NextFunction
) => {
    try {
        const blogId = req.params.id;

        const foundBlog = await queryBlogsRepository.getBlogById(blogId);

        res.status(HTTP_STATUS_CODES.OK_200).send(foundBlog);
    } catch (err) {
        next(err);
    }
};
