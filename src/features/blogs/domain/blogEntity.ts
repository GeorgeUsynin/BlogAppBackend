import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';

const pattern = '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$';
const defaultCreatedAt = new Date().toISOString();
const defaultIsMembership = false;
// Soft delete implementation
const defaultIsDeleted = false;

export type TBlog = {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
    isDeleted: boolean;
};

type TBlogModel = Model<TBlog>;

export type BlogDocument = HydratedDocument<TBlog>;

const blogSchema = new Schema<TBlog>({
    name: { type: String, maxLength: 15, required: true },
    createdAt: { type: String, default: defaultCreatedAt },
    description: { type: String, maxLength: 500, required: true },
    isMembership: { type: Boolean, default: defaultIsMembership },
    isDeleted: { type: Boolean, default: defaultIsDeleted },
    websiteUrl: {
        type: String,
        maxLength: 100,
        required: true,
        validate: {
            validator: function (v) {
                return /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(v);
            },
            message: props => `WebsiteUrl should match the specified ${pattern} pattern`,
        },
    },
});

// Soft delete implementation
blogSchema.pre('find', function () {
    this.where({ isDeleted: false });
});
blogSchema.pre('findOne', function () {
    this.where({ isDeleted: false });
});
blogSchema.pre('countDocuments', function () {
    this.where({ isDeleted: false });
});

export const BlogModel = model<TBlog, TBlogModel>(SETTINGS.DB_COLLECTIONS.blogsCollection, blogSchema);
