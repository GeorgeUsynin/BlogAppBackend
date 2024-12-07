import { ObjectId } from 'mongodb';
import { postsCollection, TDatabase } from '../../../database/mongoDB';
import type { CreateUpdatePostInputModel } from '../models';

export const postsRepository = {
    //@ts-expect-error since ObjectId is created by MongoDB we don't need to pass it
    createPost: async (newPost: Omit<TDatabase.TPost, '_id'>) => postsCollection.insertOne(newPost),
    findPostById: async (id: string) => postsCollection.findOne({ _id: new ObjectId(id) }),
    updatePost: async (id: string, payload: CreateUpdatePostInputModel) =>
        postsCollection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...payload } }),
    deletePostById: async (id: string) => postsCollection.findOneAndDelete({ _id: new ObjectId(id) }),
};
