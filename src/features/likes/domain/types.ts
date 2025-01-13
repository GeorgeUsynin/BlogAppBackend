import { HydratedDocument, Model } from 'mongoose';
import { LikeStatus } from '../../../constants';
import { likeMethods, likeStatics } from './likeEntity';

export type TLike = {
    status: keyof typeof LikeStatus;
    userId: string;
    parentId: string;
    createdAt: string;
};

type TLikeStatics = typeof likeStatics;
type UserMethods = typeof likeMethods;

export type TLikeModel = Model<TLike, {}, UserMethods> & TLikeStatics;

export type LikeDocument = HydratedDocument<TLike, UserMethods>;
