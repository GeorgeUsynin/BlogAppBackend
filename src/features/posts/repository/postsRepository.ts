import { ObjectId, WithId } from 'mongodb';
import { postsCollection, TDatabase } from '../../../database/mongoDB';
import type { CreateUpdatePostInputModel, PostItemViewModel } from '../models';

export const postsRepository = {
    findPostById: async (id: ObjectId) => {
        const post = await postsCollection.findOne({ _id: id });
        if (!post) return null;
        return postsRepository.mapMongoPostToViewModel(post);
    },
    createPost: async (newPost: Omit<TDatabase.TPost, '_id'>) => {
        //@ts-expect-error since ObjectId is created by MongoDB we don't need to pass it
        const { insertedId } = await postsCollection.insertOne(newPost);
        return postsRepository.mapMongoPostToViewModel({ _id: insertedId, ...newPost });
    },
    updatePost: async (id: ObjectId, payload: CreateUpdatePostInputModel) => {
        return await postsCollection.findOneAndUpdate({ _id: id }, { $set: { ...payload } });
    },
    deletePostById: async (id: ObjectId) => {
        return await postsCollection.findOneAndDelete({ _id: id });
    },
    mapMongoPostToViewModel: (post: WithId<TDatabase.TPost>): PostItemViewModel => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        blogName: post.blogName,
        content: post.content,
        blogId: post.blogId,
        createdAt: post.createdAt,
    }),
};
