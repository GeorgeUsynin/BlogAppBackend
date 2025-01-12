import { model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';
import { CommentDocument, TComment, TCommentModel } from './types';
import { CreateCommentDTO } from '../application';
import { APIError } from '../../shared/helpers';
import { LikeStatus, ResultStatus } from '../../../constants';

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

export const commentStatics = {
    createComment(dto: CreateCommentDTO) {
        const newComment = new CommentModel(dto);

        return newComment;
    },
};

export const commentMethods = {
    isCommentOwner(userId: string) {
        const that = this as CommentDocument;

        if (that.commentatorInfo.userId !== userId) {
            throw new APIError({
                status: ResultStatus.Forbidden,
                message: 'You are not allowed to modify this comment',
            });
        }

        return true;
    },

    updateLikesInfoCount(newLikeStatus: keyof typeof LikeStatus, oldLikeStatus?: keyof typeof LikeStatus) {
        const that = this as CommentDocument;

        if (!oldLikeStatus) {
            if (newLikeStatus === LikeStatus.Like) {
                that.likesInfo.likesCount += 1;
            } else if (newLikeStatus === LikeStatus.Dislike) {
                that.likesInfo.dislikesCount += 1;
            }
        } else {
            switch (oldLikeStatus) {
                case LikeStatus.Like:
                    if (newLikeStatus === LikeStatus.Dislike) {
                        that.likesInfo.likesCount -= 1;
                        that.likesInfo.dislikesCount += 1;
                    } else if (newLikeStatus === LikeStatus.None) {
                        that.likesInfo.likesCount -= 1;
                    }
                    break;

                case LikeStatus.Dislike:
                    if (newLikeStatus === LikeStatus.Like) {
                        that.likesInfo.likesCount += 1;
                        that.likesInfo.dislikesCount -= 1;
                    } else if (newLikeStatus === LikeStatus.None) {
                        that.likesInfo.dislikesCount -= 1;
                    }
                    break;

                case LikeStatus.None:
                    if (newLikeStatus === LikeStatus.Like) {
                        that.likesInfo.likesCount += 1;
                    } else if (newLikeStatus === LikeStatus.Dislike) {
                        that.likesInfo.dislikesCount += 1;
                    }
                    break;
            }
        }
    },
};

commentSchema.statics = commentStatics;
commentSchema.methods = commentMethods;

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
