import { postsRepository } from '../repository';
import type { CreateUpdatePostInputModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';
import { blogsRepository } from '../../blogs/repository';

export const postsService = {
    async createPost(payload: CreateUpdatePostInputModel) {
        const blogId = payload.blogId;
        const linkedBlogName = (await blogsRepository.getBlogById(blogId))?.name as string;
        const newPost: Omit<TDatabase.TPost, '_id'> = {
            ...payload,
            blogName: linkedBlogName,
            createdAt: new Date().toISOString(),
        };

        return postsRepository.createPost(newPost);
    },

    async createPostByBlogId(payload: CreateUpdatePostInputModel, blogId: string) {
        const blog = await blogsRepository.getBlogById(blogId);

        if (!blog) {
            return null;
        }

        return this.createPost({ ...payload, blogId });
    },

    async updatePost(postId: string, payload: CreateUpdatePostInputModel) {
        return postsRepository.updatePost(postId, payload);
    },

    async deletePostById(postId: string) {
        return postsRepository.deletePostById(postId);
    },
};
