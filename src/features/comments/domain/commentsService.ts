import { InsertOneResult } from 'mongodb';
import { CreateUpdateCommentInputModel } from '../models';
import { Result, ResultStatus } from '../../shared/types';
import { TDatabase } from '../../../database/mongoDB';
import { postsRepository } from '../../posts/repository';
import { usersRepository } from '../../users/repository';
import { commentsRepository } from '../repository';

export const commentsService = {
    createCommentByPostId: async (
        payload: CreateUpdateCommentInputModel,
        postId: string,
        userId: string
    ): Promise<Result<InsertOneResult<TDatabase.TComment> | null>> => {
        const post = await postsRepository.findPostById(postId);

        if (!post) {
            return { data: null, status: ResultStatus.NotFound };
        }

        const user = await usersRepository.findUserById(userId);

        const newComment: Omit<TDatabase.TComment, '_id'> = {
            ...payload,
            postId,
            commentatorInfo: {
                userId: userId,
                userLogin: user?.login as string,
            },
            createdAt: new Date().toISOString(),
        };

        const data = await commentsRepository.createComment(newComment);

        return { data, status: ResultStatus.Success };
    },
    updateCommentById: async (
        commentId: string,
        userId: string,
        payload: CreateUpdateCommentInputModel
    ): Promise<Result<TDatabase.TComment | null>> => {
        const comment = await commentsRepository.findCommentById(commentId);

        if (!comment) {
            return { data: null, status: ResultStatus.NotFound };
        }

        if (comment.commentatorInfo.userId === userId) {
            const data = await commentsRepository.updateComment(commentId, payload);
            const status = ResultStatus.Success;
            return { data, status };
        }

        return { data: null, status: ResultStatus.Forbidden };
    },
    deleteCommentById: async (commentId: string, userId: string): Promise<Result<TDatabase.TComment | null>> => {
        const comment = await commentsRepository.findCommentById(commentId);

        if (!comment) {
            return { data: null, status: ResultStatus.NotFound };
        }

        if (comment.commentatorInfo.userId === userId) {
            const data = await commentsRepository.deleteCommentById(commentId);
            return { data, status: ResultStatus.Success };
        }

        return { data: null, status: ResultStatus.Forbidden };
    },
};
