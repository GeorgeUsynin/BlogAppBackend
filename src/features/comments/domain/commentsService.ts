import { CreateUpdateCommentInputModel } from '../models';
import { TDatabase } from '../../../database/mongoDB';
import { postsRepository } from '../../posts/repository';
import { usersRepository } from '../../users/repository';
import { commentsRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../../constants';

export const commentsService = {
    createCommentByPostId: async (payload: CreateUpdateCommentInputModel, postId: string, userId: string) => {
        const post = await postsRepository.findPostById(postId);

        if (!post) {
            return null;
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

        return commentsRepository.createComment(newComment);
    },
    updateCommentById: async (commentId: string, userId: string, payload: CreateUpdateCommentInputModel) => {
        const comment = await commentsRepository.findCommentById(commentId);

        if (!comment) {
            return null;
        }

        if (comment.commentatorInfo.userId === userId) {
            return commentsRepository.updateComment(commentId, payload);
        }

        return { statusCode: HTTP_STATUS_CODES.FORBIDDEN_403 };
    },
    deleteCommentById: async (commentId: string, userId: string) => {
        const comment = await commentsRepository.findCommentById(commentId);

        if (!comment) {
            return null;
        }

        if (comment.commentatorInfo.userId === userId) {
            return commentsRepository.deleteCommentById(commentId);
        }

        return { statusCode: HTTP_STATUS_CODES.FORBIDDEN_403 };
    },
};
