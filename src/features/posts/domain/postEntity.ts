import { model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';
import { PostDocument, TPost, TPostModel } from './types';
import { CreatePostDTO } from '../application/dto';
import { LikeStatus } from '../../../constants';

const postSchema = new Schema<TPost>({
    title: { type: String, maxLength: 30, required: true },
    shortDescription: { type: String, maxLength: 100, required: true },
    content: { type: String, maxLength: 1000, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    likesInfo: {
        dislikesCount: { type: Number, default: 0 },
        likesCount: { type: Number, default: 0 },
    },
    isDeleted: { type: Boolean, default: false },
});

export const postStatics = {
    createPost(dto: CreatePostDTO) {
        const newPost = new PostModel(dto);

        return newPost;
    },
};

export const postMethods = {
    updateLikesInfoCount(newLikeStatus: keyof typeof LikeStatus, oldLikeStatus?: keyof typeof LikeStatus) {
        const that = this as PostDocument;

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

postSchema.statics = postStatics;
postSchema.methods = postMethods;

// Soft delete implementation
postSchema.pre('find', function () {
    this.where({ isDeleted: false });
});
postSchema.pre('findOne', function () {
    this.where({ isDeleted: false });
});
postSchema.pre('countDocuments', function () {
    this.where({ isDeleted: false });
});

export const PostModel = model<TPost, TPostModel>(SETTINGS.DB_COLLECTIONS.postsCollection, postSchema);
