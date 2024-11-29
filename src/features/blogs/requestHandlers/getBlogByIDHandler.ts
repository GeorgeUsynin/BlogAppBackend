import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsBlogIDModel, BlogItemViewModel } from '../models';
import { queryBlogsRepository } from '../repository';

export const getBlogByIDHandler = async (req: Request<URIParamsBlogIDModel>, res: Response<BlogItemViewModel>) => {
    const blogId = req.params.id;

    const foundBlog = await queryBlogsRepository.getBlogById(blogId);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.send(foundBlog);
};
