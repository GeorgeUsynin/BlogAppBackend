import { ObjectId } from 'mongodb';
import { postsCollection, TDatabase } from '../../../database/mongoDB';
import type { CreateUpdatePostInputModel } from '../models';

export const postsRepository = {
    findPostById: async (id: ObjectId) => postsCollection.findOne({ _id: id }),
    //@ts-expect-error since ObjectId is created by MongoDB we don't need to pass it
    createPost: async (newPost: Omit<TDatabase.TPost, '_id'>) => postsCollection.insertOne(newPost),
    updatePost: async (id: ObjectId, payload: CreateUpdatePostInputModel) =>
        postsCollection.findOneAndUpdate({ _id: id }, { $set: { ...payload } }),
    deletePostById: async (id: ObjectId) => postsCollection.findOneAndDelete({ _id: id }),
};
