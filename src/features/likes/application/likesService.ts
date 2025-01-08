import { inject, injectable } from 'inversify';
import { LikeStatus, ResultStatus } from '../../../constants';
import { APIError } from '../../shared/helpers';
import { CommentsRepository } from '../../comments/infrastructure';
import { LikesRepository } from '../infrastructure';
import { TLike } from '../domain';

@injectable()
export class LikesService {
    constructor(
        @inject(LikesRepository) private likesRepository: LikesRepository,
        @inject(CommentsRepository) private commentsRepository: CommentsRepository
    ) {}

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

            const newLike = new TLike({ parentId: commentId, userId, status: likeStatus });

            await this.likesRepository.createLike(newLike);

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
