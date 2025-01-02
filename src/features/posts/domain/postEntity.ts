import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';

type TPostValues = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};
export class TPost {
    public title: string;
    public shortDescription: string;
    public content: string;
    public blogId: string;
    public blogName: string;
    public createdAt: string;

    constructor(values: TPostValues) {
        this.title = values.title;
        this.shortDescription = values.shortDescription;
        this.content = values.content;
        this.blogId = values.blogId;
        this.blogName = values.blogName;
        this.createdAt = values.createdAt;
    }
}

type TPostModel = Model<TPost>;

export type PostDocument = HydratedDocument<TPost>;

const postSchema = new Schema<TPost>({
    title: { type: String, maxLength: 30, required: true },
    shortDescription: { type: String, maxLength: 100, required: true },
    content: { type: String, maxLength: 1000, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
});

export const PostModel = model<TPost, TPostModel>(SETTINGS.DB_COLLECTIONS.postsCollection, postSchema);
