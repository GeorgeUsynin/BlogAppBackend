import { HydratedDocument, Model } from 'mongoose';
import { blogStatics } from './blogEntity';

export type TBlog = {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
    isDeleted: boolean;
};

type BlogStatics = typeof blogStatics;

export type BlogDocument = HydratedDocument<TBlog>;

export type TBlogModel = Model<TBlog> & BlogStatics;
