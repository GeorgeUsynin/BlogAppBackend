import { HydratedDocument, Model } from 'mongoose';
import { commentMethods, commentStatics } from './commentEntity';

export type TComment = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
    postId: string;
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
    };
    isDeleted: boolean;
};

type TCommentStatics = typeof commentStatics;
type TCommentMethods = typeof commentMethods;

export type TCommentModel = Model<TComment, {}, TCommentMethods> & TCommentStatics;

export type CommentDocument = HydratedDocument<TComment, TCommentMethods>;
