import { blogsRepository } from '../repository';
import type { CreateUpdateBlogInputModel } from '../models';
import { APIError } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';
import { TBlog } from './blogEntity';

export const blogsService = {
    async createBlog(payload: CreateUpdateBlogInputModel) {
        const newBlog: TBlog = {
            ...payload,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };

        return blogsRepository.createBlog(newBlog);
    },

    async updateBlog(blogId: string, payload: CreateUpdateBlogInputModel) {
        const updatedBlog = await blogsRepository.updateBlog(blogId, payload);

        if (!updatedBlog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Blog was not found',
            });
        }

        return updatedBlog;
    },

    async deleteBlogById(blogId: string) {
        const foundBlog = await blogsRepository.deleteBlogById(blogId);

        if (!foundBlog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Blog was not found',
            });
        }
    },
};
