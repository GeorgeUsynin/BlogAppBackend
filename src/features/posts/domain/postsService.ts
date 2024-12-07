import { ObjectId } from 'mongodb';
import { postsRepository } from '../repository';
import type { CreateUpdatePostInputModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';
import { blogsRepository } from '../../blogs/repository';

export const postsService = {
    createPost: async (payload: CreateUpdatePostInputModel) => {
        const blogId = payload.blogId;
        const linkedBlogName = (await blogsRepository.getBlogById(blogId))?.name as string;
        const newPost: Omit<TDatabase.TPost, '_id'> = {
            ...payload,
            blogName: linkedBlogName,
            createdAt: new Date().toISOString(),
        };

        return postsRepository.createPost(newPost);
    },
    createPostByBlogId: async (payload: CreateUpdatePostInputModel, blogId: string) => {
        const blog = await blogsRepository.getBlogById(blogId);

        if (!blog) {
            return null;
        }

        return postsService.createPost({ ...payload, blogId });
    },
    updatePost: async (postId: string, payload: CreateUpdatePostInputModel) =>
        postsRepository.updatePost(postId, payload),
    deletePostById: async (postId: string) => postsRepository.deletePostById(postId),
};
