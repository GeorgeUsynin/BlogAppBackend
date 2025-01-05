import { CreateUpdateCommentInputModel } from '../models';
import { UsersRepository } from '../../users/repository';
import { CommentsRepository } from '../repository';
import { LikeStatus, ResultStatus } from '../../../constants';
import { APIError } from '../../shared/helpers';
import { TComment } from './commentEntity';
import { PostsRepository } from '../../posts/repository';
import { LikesRepository } from '../../likes/repository';

export class CommentsService {
    constructor(
        private commentsRepository: CommentsRepository,
        private postsRepository: PostsRepository,
        private usersRepository: UsersRepository,
        private likesRepository: LikesRepository
    ) {}

    async createCommentByPostId(payload: CreateUpdateCommentInputModel, postId: string, userId: string) {
        const { content } = payload;
        const post = await this.postsRepository.findPostById(postId);

        if (!post) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Post was not found',
            });
        }

        const user = await this.usersRepository.findUserById(userId);

        const newComment = new TComment({
            content,
            commentatorInfo: { userId, userLogin: user?.login as string },
            createdAt: new Date().toISOString(),
            postId,
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
            },
        });

        return await this.commentsRepository.createComment(newComment);
    }

    async updateCommentById(commentId: string, userId: string, payload: CreateUpdateCommentInputModel) {
        const comment = await this.commentsRepository.findCommentById(commentId);

        if (!comment) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Comment was not found',
            });
        }

        if (comment.commentatorInfo.userId !== userId) {
            throw new APIError({
                status: ResultStatus.Forbidden,
                message: 'You are not allowed to update this comment',
            });
        }

        await this.commentsRepository.updateComment(commentId, payload);
    }

    async deleteCommentById(commentId: string, userId: string) {
        const comment = await this.commentsRepository.findCommentById(commentId);

        if (!comment) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Comment was not found',
            });
        }

        if (comment.commentatorInfo.userId !== userId) {
            throw new APIError({
                status: ResultStatus.Forbidden,
                message: 'You are not allowed to delete this comment',
            });
        }

        await this.commentsRepository.deleteCommentById(commentId);
    }

    async updateLikeStatusByCommentID(commentId: string, likeStatus: keyof typeof LikeStatus, userId: string) {
        const comment = await this.commentsRepository.findCommentById(commentId);

        if (!comment) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Comment does not exist',
            });
        }

        const like = await this.likesRepository.findLikeByParams({ parentId: commentId, userId });

        if (!like) {
            if (likeStatus === LikeStatus.None) return;

            await this.likesRepository.createLike({ parentId: commentId, userId, likeStatus });

            if (likeStatus === LikeStatus.Like) {
                comment.likesInfo.likesCount += 1;
            } else if (likeStatus === LikeStatus.Dislike) {
                comment.likesInfo.dislikesCount += 1;
            }

            await this.commentsRepository.saveComment(comment);
            return;
        }

        const currentStatus = like.status;

        // Avoid update if new status is the same as current one
        if (currentStatus === likeStatus) {
            return;
        }

        // Update and save like status
        like.status = likeStatus;
        await this.likesRepository.saveLike(like);

        // Update likes and dislikes logic
        switch (currentStatus) {
            case LikeStatus.Like:
                if (likeStatus === LikeStatus.Dislike) {
                    comment.likesInfo.likesCount -= 1;
                    comment.likesInfo.dislikesCount += 1;
                } else if (likeStatus === LikeStatus.None) {
                    comment.likesInfo.likesCount -= 1;
                }
                break;

            case LikeStatus.Dislike:
                if (likeStatus === LikeStatus.Like) {
                    comment.likesInfo.likesCount += 1;
                    comment.likesInfo.dislikesCount -= 1;
                } else if (likeStatus === LikeStatus.None) {
                    comment.likesInfo.dislikesCount -= 1;
                }
                break;

            case LikeStatus.None:
                if (likeStatus === LikeStatus.Like) {
                    comment.likesInfo.likesCount += 1;
                } else if (likeStatus === LikeStatus.Dislike) {
                    comment.likesInfo.dislikesCount += 1;
                }
                break;
        }

        // Save the updated comment
        await this.commentsRepository.saveComment(comment);
    }
}
