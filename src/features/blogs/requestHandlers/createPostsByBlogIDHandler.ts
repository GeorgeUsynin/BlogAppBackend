import { Response } from 'express';
import { RequestWithParamsAndBody } from '../../shared/types';
import { URIParamsBlogIDPostModel } from '../models';
import { CreateUpdatePostInputModel, PostItemViewModel } from '../../posts/models';
import { blogsService } from '../domain';
import { HTTP_STATUS_CODES } from '../../../constants';

export const createPostsByBlogIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsBlogIDPostModel, CreateUpdatePostInputModel>,
    res: Response<PostItemViewModel>
) => {
    const blogId = req.params.blogId;
    const payload = req.body;

    const blog = await blogsService.findBlogById(blogId);
    if (!blog) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    const newPost = await blogsService.createPostByBlogId(payload, blogId);

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newPost);
};
