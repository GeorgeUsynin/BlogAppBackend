import { blogsRepository } from '../repository';
import type { CreateUpdateBlogInputModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';

export const blogsService = {
    createBlog: async (payload: CreateUpdateBlogInputModel) => {
        const newBlog: Omit<TDatabase.TBlog, '_id'> = {
            ...payload,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };

        return blogsRepository.createBlog(newBlog);
    },
    updateBlog: async (blogId: string, payload: CreateUpdateBlogInputModel) => {
        return blogsRepository.updateBlog(blogId, payload);
    },
    deleteBlogById: async (blogId: string) => blogsRepository.deleteBlogById(blogId),
};
