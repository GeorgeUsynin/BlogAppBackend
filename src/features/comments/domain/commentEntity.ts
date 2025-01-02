import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';

type TCommentValues = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
    postId: string;
};
export class TComment {
    public content: string;
    public commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    public createdAt: string;
    public postId: string;

    constructor(values: TCommentValues) {
        this.content = values.content;
        this.commentatorInfo = values.commentatorInfo;
        this.createdAt = values.createdAt;
        this.postId = values.postId;
    }
}

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
