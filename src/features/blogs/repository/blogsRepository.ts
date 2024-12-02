import { ObjectId } from 'mongodb';
import { blogsCollection, TDatabase } from '../../../database/mongoDB';
import type { CreateUpdateBlogInputModel } from '../models';

export const blogsRepository = {
    getBlogById: async (id: ObjectId) => blogsCollection.findOne({ _id: id }),
    //@ts-expect-error since ObjectId will be created by MongoDB we don't need to pass it
    createBlog: async (newBlog: Omit<TDatabase.TBlog, '_id'>) => blogsCollection.insertOne(newBlog),
    updateBlog: async (id: ObjectId, payload: CreateUpdateBlogInputModel) =>
        blogsCollection.findOneAndUpdate({ _id: id }, { $set: { ...payload } }),
    deleteBlogById: async (id: ObjectId) => blogsCollection.findOneAndDelete({ _id: id }),
};
