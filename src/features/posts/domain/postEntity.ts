import { model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';
import { TPost, TPostModel } from './types';
import { CreatePostDTO } from '../application/dto';

const postSchema = new Schema<TPost>({
    title: { type: String, maxLength: 30, required: true },
    shortDescription: { type: String, maxLength: 100, required: true },
    content: { type: String, maxLength: 1000, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    isDeleted: { type: Boolean, default: false },
});

export const postStatics = {
    createPost(dto: CreatePostDTO) {
        const newPost = new PostModel(dto);

        return newPost;
    },
};

postSchema.statics = postStatics;

// Soft delete implementation
postSchema.pre('find', function () {
    this.where({ isDeleted: false });
});
postSchema.pre('findOne', function () {
    this.where({ isDeleted: false });
});
postSchema.pre('countDocuments', function () {
    this.where({ isDeleted: false });
});

export const PostModel = model<TPost, TPostModel>(SETTINGS.DB_COLLECTIONS.postsCollection, postSchema);
