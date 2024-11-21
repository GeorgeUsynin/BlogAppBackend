import { ObjectId, WithId } from 'mongodb';
import { postsCollection, TDatabase } from '../../../database/mongoDB';
import type { CreateUpdatePostInputModel, PostViewModel } from '../models';
import { blogsRepository } from '../../blogs/repository';

export const postsRepository = {
    findAllPosts: async () => {
        const posts = await postsCollection.find({}).toArray();
        return posts.map(post => postsRepository.mapMongoPostToViewModel(post));
    },
    findPostById: async (id: ObjectId) => {
        const post = await postsCollection.findOne({ _id: id });
        if (!post) return null;
        return postsRepository.mapMongoPostToViewModel(post);
    },
    addPost: async (payload: CreateUpdatePostInputModel) => {
        const blogId = new ObjectId(payload.blogId);
        const linkedBlogName = (await blogsRepository.findBlogById(blogId))?.name as string;
        const newPost = {
            ...payload,
            blogName: linkedBlogName,
        };
        const { insertedId } = await postsCollection.insertOne(newPost);
        return postsRepository.mapMongoPostToViewModel({ _id: insertedId, ...newPost });
    },
    updatePost: async (id: ObjectId, payload: CreateUpdatePostInputModel) => {
        return await postsCollection.findOneAndUpdate({ _id: id }, { $set: { ...payload } });
    },
    deletePostById: async (id: ObjectId) => {
        return await postsCollection.findOneAndDelete({ _id: id });
    },
    mapMongoPostToViewModel: (post: WithId<TDatabase.TPost>): PostViewModel => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        blogName: post.blogName,
        content: post.content,
        blogId: post.blogId,
    }),
};
