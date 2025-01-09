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
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
    };
    isDeleted: boolean;
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
    createdAt: { type: String, default: () => new Date().toISOString() },
    likesInfo: {
        dislikesCount: { type: Number, default: 0 },
        likesCount: { type: Number, default: 0 },
    },
    isDeleted: { type: Boolean, default: false },
});

// Soft delete implementation
commentSchema.pre('find', function () {
    this.where({ isDeleted: false });
});
commentSchema.pre('findOne', function () {
    this.where({ isDeleted: false });
});
commentSchema.pre('countDocuments', function () {
    this.where({ isDeleted: false });
});

export const CommentModel = model<TComment, TCommentModel>(SETTINGS.DB_COLLECTIONS.commentsCollection, commentSchema);
