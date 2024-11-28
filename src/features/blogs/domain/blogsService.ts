import { blogsRepository } from '../repository';
import { ObjectId, WithId } from 'mongodb';
import type { BlogItemViewModel, CreateUpdateBlogInputModel } from '../models';
import type { TDatabase } from '../../../database/mongoDB';
import { CreateUpdatePostInputModel } from '../../posts/models';
import { postsService } from '../../posts/domain';

export const blogsService = {
    findBlogById: async (blogId: string) => {
        const blog = await blogsRepository.findBlogById(new ObjectId(blogId));
        if (!blog) return null;
        return blogsService.mapMongoBlogToViewModel(blog);
    },
    createBlog: async (payload: CreateUpdateBlogInputModel) => {
        const newBlog: Omit<TDatabase.TBlog, '_id'> = {
            ...payload,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };

        const { insertedId } = await blogsRepository.createBlog(newBlog);
        return blogsService.mapMongoBlogToViewModel({ _id: insertedId, ...newBlog });
    },
    createPostByBlogId: async (payload: CreateUpdatePostInputModel, blogId: string) => {
        return postsService.createPost({ ...payload, blogId });
    },
    updateBlog: async (blogId: string, payload: CreateUpdateBlogInputModel) => {
        return blogsRepository.updateBlog(new ObjectId(blogId), payload);
    },
    deleteBlogById: async (blogId: string) => blogsRepository.deleteBlogById(new ObjectId(blogId)),
    mapMongoBlogToViewModel: (blog: WithId<TDatabase.TBlog>): BlogItemViewModel => ({
        id: blog._id.toString(),
        description: blog.description,
        name: blog.name,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    }),
};
