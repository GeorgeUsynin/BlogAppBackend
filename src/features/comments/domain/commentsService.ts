import { CreateUpdateCommentInputModel } from '../models';
import { usersRepository } from '../../users/repository';
import { CommentsRepository } from '../repository';
import { ResultStatus } from '../../../constants';
import { APIError } from '../../shared/helpers';
import { TComment } from './commentEntity';
import { PostsRepository } from '../../posts/repository';

export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository, protected postsRepository: PostsRepository) {}

    async createCommentByPostId(payload: CreateUpdateCommentInputModel, postId: string, userId: string) {
        const { content } = payload;
        const post = await this.postsRepository.findPostById(postId);

        if (!post) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Post was not found',
            });
        }

        const user = await usersRepository.findUserById(userId);

        const newComment = new TComment({
            content,
            userId,
            userLogin: user?.login as string,
            createdAt: new Date().toISOString(),
            postId,
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
}
