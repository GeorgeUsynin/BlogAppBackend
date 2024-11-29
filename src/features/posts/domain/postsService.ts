import { ObjectId } from 'mongodb';
import { postsRepository } from '../repository';
import type { CreateUpdatePostInputModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';
import { queryBlogsRepository } from '../../blogs/repository';

export const postsService = {
    createPost: async (payload: CreateUpdatePostInputModel) => {
        const blogId = payload.blogId;
        const linkedBlogName = (await queryBlogsRepository.getBlogById(blogId))?.name as string;
        const newPost: Omit<TDatabase.TPost, '_id'> = {
            ...payload,
            blogName: linkedBlogName,
            createdAt: new Date().toISOString(),
        };

        return postsRepository.createPost(newPost);
    },
    updatePost: async (postId: string, payload: CreateUpdatePostInputModel) =>
        postsRepository.updatePost(new ObjectId(postId), payload),
    deletePostById: async (postId: string) => postsRepository.deletePostById(new ObjectId(postId)),
};
