import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';

const defaultLikesCount = 0;
const defaultDislikesCount = 0;
const defaultCreatedAt = new Date().toISOString();
// Soft delete implementation
const defaultIsDeleted = false;

type TCommentValues = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
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
    public likesInfo: {
        likesCount: number;
        dislikesCount: number;
    };
    public isDeleted: boolean;

    constructor(values: TCommentValues) {
        this.content = values.content;
        this.commentatorInfo = values.commentatorInfo;
        this.createdAt = defaultCreatedAt;
        this.postId = values.postId;
        this.likesInfo = {
            dislikesCount: defaultDislikesCount,
            likesCount: defaultLikesCount,
        };
        this.isDeleted = defaultIsDeleted;
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
    createdAt: { type: String, default: defaultCreatedAt },
    likesInfo: {
        dislikesCount: { type: Number, default: 0 },
        likesCount: { type: Number, default: 0 },
    },
    isDeleted: { type: Boolean, default: defaultIsDeleted },
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
