import { ObjectId } from 'mongodb';
import { postsCollection, TDatabase } from '../../../database';
import type { CreateUpdatePostInputModel } from '../models';

export const postsRepository = {
    async createPost(newPost: Omit<TDatabase.TPost, '_id'>) {
        //@ts-expect-error since ObjectId is created by MongoDB we don't need to pass it
        return postsCollection.insertOne(newPost);
    },
    async findPostById(id: string) {
        return postsCollection.findOne({ _id: new ObjectId(id) });
    },
    async updatePost(id: string, payload: CreateUpdatePostInputModel) {
        return postsCollection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...payload } });
    },
    async deletePostById(id: string) {
        return postsCollection.findOneAndDelete({ _id: new ObjectId(id) });
    },
};
