import { inject, injectable } from 'inversify';
import { LikeStatus, ResultStatus } from '../../../constants';
import { APIError } from '../../shared/helpers';
import { CommentsRepository } from '../../comments/infrastructure';
import { LikesRepository } from '../infrastructure';
import { LikeModel } from '../domain';
import { PostsRepository } from '../../posts/infrastructure';

@injectable()
export class LikesService {
    constructor(
        @inject(LikesRepository) private likesRepository: LikesRepository,
        @inject(CommentsRepository) private commentsRepository: CommentsRepository,
        @inject(PostsRepository) private postsRepository: PostsRepository
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

            const newLike = LikeModel.createLike({ parentId: commentId, userId, status: likeStatus });
            await this.likesRepository.save(newLike);

            foundComment.updateLikesInfoCount(likeStatus);
            await this.commentsRepository.save(foundComment);

            return;
        }

        const oldLikeStatus = like.status;

        // Avoid update if new status is the same as current one
        if (like.isSameStatus(likeStatus)) {
            return;
        } else {
            like.status = likeStatus;
            await this.likesRepository.save(like);
        }

        foundComment.updateLikesInfoCount(likeStatus, oldLikeStatus);
        await this.commentsRepository.save(foundComment);
    }

    async updateLikeStatusByPostID(postId: string, likeStatus: keyof typeof LikeStatus, userId: string) {
        const foundPost = await this.postsRepository.findPostById(postId);

        if (!foundPost) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Post does not exist',
            });
        }

        const like = await this.likesRepository.findLikeByParams({ parentId: postId, userId });

        if (!like) {
            if (likeStatus === LikeStatus.None) return;

            const newLike = LikeModel.createLike({ parentId: postId, userId, status: likeStatus });
            await this.likesRepository.save(newLike);

            foundPost.updateLikesInfoCount(likeStatus);
            await this.postsRepository.save(foundPost);

            return;
        }

        const oldLikeStatus = like.status;

        // Avoid update if new status is the same as current one
        if (like.isSameStatus(likeStatus)) {
            return;
        } else {
            like.status = likeStatus;
            await this.likesRepository.save(like);
        }

        foundPost.updateLikesInfoCount(likeStatus, oldLikeStatus);
        await this.postsRepository.save(foundPost);
    }
}
