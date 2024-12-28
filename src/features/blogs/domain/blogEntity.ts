import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';

const pattern = '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$';

export type TBlog = {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
};

type TBlogModel = Model<TBlog>;

export type BLogDocument = HydratedDocument<TBlog>;

const blogSchema = new Schema<TBlog>({
    name: { type: String, maxLength: 15, required: true },
    createdAt: { type: String, required: true },
    description: { type: String, maxLength: 500, required: true },
    isMembership: { type: Boolean, default: false, required: true },
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

export const BlogModel = model<TBlog, TBlogModel>(SETTINGS.DB_COLLECTIONS.blogsCollection, blogSchema);
