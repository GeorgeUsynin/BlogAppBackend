import { postsRepository } from '../repository';
import type { CreateUpdatePostInputModel } from '../models';
import { blogsRepository } from '../../blogs/repository';
import { APIError } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';
import { TPost } from './postEntity';

export const postsService = {
    async createPost(payload: CreateUpdatePostInputModel) {
        const blogId = payload.blogId;
        const linkedBlogName = (await blogsRepository.getBlogById(blogId))?.name as string;
        const newPost: TPost = {
            ...payload,
            blogName: linkedBlogName,
            createdAt: new Date().toISOString(),
        };

        return postsRepository.createPost(newPost);
    },

    async createPostByBlogId(payload: CreateUpdatePostInputModel, blogId: string) {
        const blog = await blogsRepository.getBlogById(blogId);

        if (!blog) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Blog was not found',
            });
        }

        return this.createPost({ ...payload, blogId });
    },

    async updatePost(postId: string, payload: CreateUpdatePostInputModel) {
        const updatedPost = await postsRepository.updatePost(postId, payload);

        if (!updatedPost) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Post was not found',
            });
        }

        return updatedPost;
    },

    async deletePostById(postId: string) {
        const deletedPost = await postsRepository.deletePostById(postId);

        if (!deletedPost) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Post was not found',
            });
        }
    },
};
