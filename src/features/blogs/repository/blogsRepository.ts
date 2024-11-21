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
        const { insertedId } = await blogsCollection.insertOne({ ...payload });
        return blogsRepository.mapMongoBlogToViewModel({ _id: insertedId, ...payload });
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
    }),
};
