import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';

const pattern = '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$';

type TBlogValues = {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
};
export class TBlog {
    public name: string;
    public description: string;
    public websiteUrl: string;
    public createdAt: string;
    public isMembership: boolean;

    constructor(values: TBlogValues) {
        this.name = values.name;
        this.description = values.description;
        this.websiteUrl = values.websiteUrl;
        this.createdAt = values.createdAt;
        this.isMembership = values.isMembership;
    }
}

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
