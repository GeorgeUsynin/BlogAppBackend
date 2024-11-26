import { blogsRepository } from '../repository';
import { ObjectId } from 'mongodb';
import type { CreateUpdateBlogInputModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';
import { CreateUpdatePostInputModel } from '../../posts/models';
import { postsService } from '../../posts/domain';

export const blogsService = {
    findBlogById: async (blogId: string) => blogsRepository.findBlogById(new ObjectId(blogId)),
    createBlog: async (payload: CreateUpdateBlogInputModel) => {
        const newBlog: Omit<TDatabase.TBlog, '_id'> = {
            ...payload,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        return blogsRepository.createBlog(newBlog);
    },
    createPostByBlogId: async (payload: CreateUpdatePostInputModel, blogId: string) => {
        return postsService.createPost({ ...payload, blogId });
    },
    updateBlog: async (blogId: string, payload: CreateUpdateBlogInputModel) => {
        return blogsRepository.updateBlog(new ObjectId(blogId), payload);
    },
    deleteBlogById: async (blogId: string) => blogsRepository.deleteBlogById(new ObjectId(blogId)),
};
