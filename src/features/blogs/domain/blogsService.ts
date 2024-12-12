import { blogsRepository } from '../repository';
import type { CreateUpdateBlogInputModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';

export const blogsService = {
    async createBlog(payload: CreateUpdateBlogInputModel) {
        const newBlog: Omit<TDatabase.TBlog, '_id'> = {
            ...payload,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };

        return blogsRepository.createBlog(newBlog);
    },

    async updateBlog(blogId: string, payload: CreateUpdateBlogInputModel) {
        return blogsRepository.updateBlog(blogId, payload);
    },

    async deleteBlogById(blogId: string) {
        return blogsRepository.deleteBlogById(blogId);
    },
};
