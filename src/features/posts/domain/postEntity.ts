import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';

type TPostValues = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
};
export type TPost = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    isDeleted: boolean;
};

type TPostModel = Model<TPost>;

export type PostDocument = HydratedDocument<TPost>;

const postSchema = new Schema<TPost>({
    title: { type: String, maxLength: 30, required: true },
    shortDescription: { type: String, maxLength: 100, required: true },
    content: { type: String, maxLength: 1000, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    isDeleted: { type: Boolean, default: false },
});

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
