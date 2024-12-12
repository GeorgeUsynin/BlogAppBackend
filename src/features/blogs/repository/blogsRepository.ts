import { ObjectId } from 'mongodb';
import { blogsCollection, TDatabase } from '../../../database/mongoDB';
import type { CreateUpdateBlogInputModel } from '../models';

export const blogsRepository = {
    async getBlogById(id: string) {
        return blogsCollection.findOne({ _id: new ObjectId(id) });
    },
    async createBlog(newBlog: Omit<TDatabase.TBlog, '_id'>) {
        //@ts-expect-error since ObjectId will be created by MongoDB we don't need to pass it
        return blogsCollection.insertOne(newBlog);
    },
    async updateBlog(id: string, payload: CreateUpdateBlogInputModel) {
        return blogsCollection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...payload } });
    },
    async deleteBlogById(id: string) {
        return blogsCollection.findOneAndDelete({ _id: new ObjectId(id) });
    },
};
