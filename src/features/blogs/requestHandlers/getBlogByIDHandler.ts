import { blogsRepository } from '../repository';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsBlogIDModel, BlogViewModel } from '../models';
import { ObjectId } from 'mongodb';

export const getBlogByIDHandler = async (req: Request<URIParamsBlogIDModel>, res: Response<BlogViewModel>) => {
    const blogId = new ObjectId(req.params.id);

    const foundBlog = await blogsRepository.findBlogById(blogId);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.send(foundBlog);
};
