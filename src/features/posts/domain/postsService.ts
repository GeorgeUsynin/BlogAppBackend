import { ObjectId, WithId } from 'mongodb';
import { postsRepository } from '../repository';
import { blogsService } from '../../blogs/domain/blogsService';
import type { CreateUpdatePostInputModel, PostItemViewModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';

export const postsService = {
    findPostById: async (postId: string) => {
        const post = await postsRepository.findPostById(new ObjectId(postId));
        if (!post) return null;
        return postsService.mapMongoPostToViewModel(post);
    },
    createPost: async (payload: CreateUpdatePostInputModel) => {
        const blogId = payload.blogId;
        const linkedBlogName = (await blogsService.findBlogById(blogId))?.name as string;
        const newPost: Omit<TDatabase.TPost, '_id'> = {
            ...payload,
            blogName: linkedBlogName,
            createdAt: new Date().toISOString(),
        };

        const { insertedId } = await postsRepository.createPost(newPost);
        return postsService.mapMongoPostToViewModel({ _id: insertedId, ...newPost });
    },
    updatePost: async (postId: string, payload: CreateUpdatePostInputModel) =>
        postsRepository.updatePost(new ObjectId(postId), payload),
    deletePostById: async (postId: string) => postsRepository.deletePostById(new ObjectId(postId)),
    mapMongoPostToViewModel: (post: WithId<TDatabase.TPost>): PostItemViewModel => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        blogName: post.blogName,
        content: post.content,
        blogId: post.blogId,
        createdAt: post.createdAt,
    }),
};
