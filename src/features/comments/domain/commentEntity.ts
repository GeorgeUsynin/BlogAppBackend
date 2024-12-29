import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';

export type TComment = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
    postId: string;
};

type TCommentModel = Model<TComment>;

export type CommentDocument = HydratedDocument<TComment>;

const commentSchema = new Schema<TComment>({
    content: { type: String, minlength: 20, maxLength: 300, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    postId: { type: String, required: true },
    createdAt: { type: String, required: true },
});

export const CommentModel = model<TComment, TCommentModel>(SETTINGS.DB_COLLECTIONS.commentsCollection, commentSchema);
