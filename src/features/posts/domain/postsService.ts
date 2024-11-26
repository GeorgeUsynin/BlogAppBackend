import { ObjectId } from 'mongodb';
import { postsRepository } from '../repository';
import { blogsService } from '../../blogs/domain/blogsService';
import type { CreateUpdatePostInputModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';

export const postsService = {
    findPostById: async (postId: string) => postsRepository.findPostById(new ObjectId(postId)),
    createPost: async (payload: CreateUpdatePostInputModel) => {
        const blogId = payload.blogId;
        const linkedBlogName = (await blogsService.findBlogById(blogId))?.name as string;
        const newPost: Omit<TDatabase.TPost, '_id'> = {
            ...payload,
            blogName: linkedBlogName,
            createdAt: new Date().toISOString(),
        };

        return postsRepository.createPost(newPost);
    },
    updatePost: async (postId: string, payload: CreateUpdatePostInputModel) => {
        return postsRepository.updatePost(new ObjectId(postId), payload);
    },
    deletePostById: async (postId: string) => postsRepository.deletePostById(new ObjectId(postId)),
};
