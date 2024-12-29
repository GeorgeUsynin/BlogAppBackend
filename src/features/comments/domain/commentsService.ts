import { CreateUpdateCommentInputModel } from '../models';
import { postsRepository } from '../../posts/repository';
import { usersRepository } from '../../users/repository';
import { commentsRepository } from '../repository';
import { ResultStatus } from '../../../constants';
import { APIError } from '../../shared/helpers';
import { TComment } from './commentEntity';

export const commentsService = {
    async createCommentByPostId(payload: CreateUpdateCommentInputModel, postId: string, userId: string) {
        const post = await postsRepository.findPostById(postId);

        if (!post) {
            throw new APIError({
                status: ResultStatus.NotFound,
                message: 'Post was not found',
            });
        }

        const user = await usersRepository.findUserById(userId);

        const newComment: TComment = {
            ...payload,
            postId,
            commentatorInfo: {
                userId: userId,
                userLogin: user?.login as string,
            },
            createdAt: new Date().toISOString(),
        };

        return await commentsRepository.createComment(newComment);
    },

    async updateCommentById(commentId: string, userId: string, payload: CreateUpdateCommentInputModel) {
        const comment = await commentsRepository.findCommentById(commentId);

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

        await commentsRepository.updateComment(commentId, payload);
    },

    async deleteCommentById(commentId: string, userId: string) {
        const comment = await commentsRepository.findCommentById(commentId);

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

        await commentsRepository.deleteCommentById(commentId);
    },
};
