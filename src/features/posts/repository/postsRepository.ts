import { db } from '../../../database';
import type { CreateUpdatePostInputModel, PostViewModel } from '../models';

export const postsRepository = {
    findAllPosts: () => db.posts,
    findPostById: (id: string) => db.posts.find(post => post.id === id),
    mapRequestedPayloadToViewModel: (blogName: string, payload: CreateUpdatePostInputModel): PostViewModel => ({
        id: (+new Date()).toString(),
        title: payload.title,
        shortDescription: payload.shortDescription,
        content: payload.content,
        blogId: payload.blogId,
        blogName,
    }),
    addPost: (post: PostViewModel) => db.posts.push(post),
    updatePost: (existedPost: PostViewModel, payload: CreateUpdatePostInputModel) => {
        const index = db.posts.findIndex(post => post.id === existedPost.id);
        db.posts.splice(index, 1, { ...existedPost, ...payload });
    },
    deletePostById: (id: string) => {
        const index = db.posts.findIndex(post => post.id === id);
        db.posts.splice(index, 1);
    },
};
