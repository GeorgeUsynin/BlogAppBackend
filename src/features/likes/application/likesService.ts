import { inject, injectable } from 'inversify';
import { LikeStatus, ResultStatus } from '../../../constants';
import { APIError } from '../../shared/helpers';
import { CommentsRepository } from '../../comments/infrastructure';
import { LikesRepository } from '../infrastructure';
import { LikeModel } from '../domain';
import { PostsRepository } from '../../posts/infrastructure';
import { PostDocument } from '../../posts/domain';
import { CommentDocument } from '../../comments/domain';
import { capitalizeFirstLetter } from '../../../helpers';

type TUpdateLikeStatusByParentIDParams = {
    parentId: string;
    likeStatus: keyof typeof LikeStatus;
    userId: string;
    parentType: 'comment' | 'post';
};

@injectable()
export class LikesService {
    constructor(
        @inject(LikesRepository) private likesRepository: LikesRepository,
        @inject(CommentsRepository) private commentsRepository: CommentsRepository,
        @inject(PostsRepository) private postsRepository: PostsRepository
    ) {}

    async updateLikeStatusByParentID(params: TUpdateLikeStatusByParentIDParams) {
        const { parentId, likeStatus, userId, parentType } = params;

        let foundEntity: CommentDocument | PostDocument | null = null;

        if (parentType === 'comment') {
            foundEntity = await this.commentsRepository.findCommentById(parentId);
        } else if (parentType === 'post') {
            foundEntity = await this.postsRepository.findPostById(parentId);
        }

        if (!foundEntity) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: `${capitalizeFirstLetter(parentType)} does not exist`,
            });
        }

        const like = await this.likesRepository.findLikeByParams({ parentId, userId });

        if (!like) {
            if (likeStatus === LikeStatus.None) return;

            const newLike = LikeModel.createLike({ parentId, userId, status: likeStatus });
            await this.likesRepository.save(newLike);

            if (parentType === 'comment') {
                foundEntity.updateLikesInfoCount(likeStatus);
                await this.commentsRepository.save(foundEntity as CommentDocument);
            } else if (parentType === 'post') {
                foundEntity.updateLikesInfoCount(likeStatus);
                await this.postsRepository.save(foundEntity as PostDocument);
            }

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

        if (parentType === 'comment') {
            foundEntity.updateLikesInfoCount(likeStatus, oldLikeStatus);
            await this.commentsRepository.save(foundEntity as CommentDocument);
        } else if (parentType === 'post') {
            foundEntity.updateLikesInfoCount(likeStatus, oldLikeStatus);
            await this.postsRepository.save(foundEntity as PostDocument);
        }
    }
}
