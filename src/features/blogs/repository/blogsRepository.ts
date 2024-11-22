import { ObjectId, WithId } from 'mongodb';
import { blogsCollection, TDatabase } from '../../../database/mongoDB';
import type { CreateUpdateBlogInputModel, BlogViewModel } from '../models';

export const blogsRepository = {
    findAllBlogs: async () => {
        const blogs = await blogsCollection.find({}).toArray();
        return blogs.map(blog => blogsRepository.mapMongoBlogToViewModel(blog));
    },
    findBlogById: async (id: ObjectId) => {
        const blog = await blogsCollection.findOne({ _id: id });
        if (!blog) return null;
        return blogsRepository.mapMongoBlogToViewModel(blog);
    },
    addBlog: async (payload: CreateUpdateBlogInputModel) => {
        const newBlog = {
            ...payload,
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        //@ts-expect-error since ObjectId is created by MongoDB we don't need to pass it
        const { insertedId } = await blogsCollection.insertOne(newBlog);
        return blogsRepository.mapMongoBlogToViewModel({ _id: insertedId, ...newBlog });
    },
    updateBlog: async (id: ObjectId, payload: CreateUpdateBlogInputModel) => {
        return await blogsCollection.findOneAndUpdate({ _id: id }, { $set: { ...payload } });
    },
    deleteBlogById: async (id: ObjectId) => {
        return await blogsCollection.findOneAndDelete({ _id: id });
    },
    mapMongoBlogToViewModel: (blog: WithId<TDatabase.TBlog>): BlogViewModel => ({
        id: blog._id.toString(),
        description: blog.description,
        name: blog.name,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    }),
};
