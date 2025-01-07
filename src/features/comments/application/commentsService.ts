import { inject, injectable } from 'inversify';
import { UsersRepository } from '../../users/repository';
import { CommentsRepository } from '../infrastructure';
import { LikeStatus, ResultStatus } from '../../../constants';
import { APIError } from '../../shared/helpers';
import { TComment } from '../domain/commentEntity';
import { PostsRepository } from '../../posts/infrastructure';
import { LikesRepository } from '../../likes/repository';
import { CreateUpdateCommentInputDTO } from './dto';

@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository) private commentsRepository: CommentsRepository,
        @inject(PostsRepository) private postsRepository: PostsRepository,
        @inject(UsersRepository) private usersRepository: UsersRepository,
        @inject(LikesRepository) private likesRepository: LikesRepository
    ) {}

    async createCommentByPostId(payload: CreateUpdateCommentInputDTO, postId: string, userId: string) {
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
            postId,
        });

        return await this.commentsRepository.createComment(newComment);
    }

    async updateCommentById(commentId: string, userId: string, payload: CreateUpdateCommentInputDTO) {
        const { content } = payload;
        const foundComment = await this.commentsRepository.findCommentById(commentId);

        if (!foundComment) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Comment was not found',
            });
        }

        if (foundComment.commentatorInfo.userId !== userId) {
            throw new APIError({
                status: ResultStatus.Forbidden,
                message: 'You are not allowed to update this comment',
            });
        }

        foundComment.content = content;

        await this.commentsRepository.save(foundComment);
    }

    async deleteCommentById(commentId: string, userId: string) {
        const foundComment = await this.commentsRepository.findCommentById(commentId);

        if (!foundComment) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Comment was not found',
            });
        }

        if (foundComment.commentatorInfo.userId !== userId) {
            throw new APIError({
                status: ResultStatus.Forbidden,
                message: 'You are not allowed to delete this comment',
            });
        }

        foundComment.isDeleted = true;

        await this.commentsRepository.save(foundComment);
    }

    async updateLikeStatusByCommentID(commentId: string, likeStatus: keyof typeof LikeStatus, userId: string) {
        const foundComment = await this.commentsRepository.findCommentById(commentId);

        if (!foundComment) {
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
                foundComment.likesInfo.likesCount += 1;
            } else if (likeStatus === LikeStatus.Dislike) {
                foundComment.likesInfo.dislikesCount += 1;
            }

            await this.commentsRepository.save(foundComment);
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
                    foundComment.likesInfo.likesCount -= 1;
                    foundComment.likesInfo.dislikesCount += 1;
                } else if (likeStatus === LikeStatus.None) {
                    foundComment.likesInfo.likesCount -= 1;
                }
                break;

            case LikeStatus.Dislike:
                if (likeStatus === LikeStatus.Like) {
                    foundComment.likesInfo.likesCount += 1;
                    foundComment.likesInfo.dislikesCount -= 1;
                } else if (likeStatus === LikeStatus.None) {
                    foundComment.likesInfo.dislikesCount -= 1;
                }
                break;

            case LikeStatus.None:
                if (likeStatus === LikeStatus.Like) {
                    foundComment.likesInfo.likesCount += 1;
                } else if (likeStatus === LikeStatus.Dislike) {
                    foundComment.likesInfo.dislikesCount += 1;
                }
                break;
        }

        // Save the updated comment
        await this.commentsRepository.save(foundComment);
    }
}
