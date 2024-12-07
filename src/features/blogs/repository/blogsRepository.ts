import { ObjectId } from 'mongodb';
import { blogsCollection, TDatabase } from '../../../database/mongoDB';
import type { CreateUpdateBlogInputModel } from '../models';

export const blogsRepository = {
    getBlogById: async (id: string) => blogsCollection.findOne({ _id: new ObjectId(id) }),
    //@ts-expect-error since ObjectId will be created by MongoDB we don't need to pass it
    createBlog: async (newBlog: Omit<TDatabase.TBlog, '_id'>) => blogsCollection.insertOne(newBlog),
    updateBlog: async (id: string, payload: CreateUpdateBlogInputModel) =>
        blogsCollection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...payload } }),
    deleteBlogById: async (id: string) => blogsCollection.findOneAndDelete({ _id: new ObjectId(id) }),
};
