import { CreateUpdateCommentInputModel } from '../models';
import { TDatabase } from '../../../database/mongoDB';
import { postsRepository } from '../../posts/repository';
import { usersRepository } from '../../users/repository';
import { commentsRepository } from '../repository';
import { ObjectId } from 'mongodb';

export const commentsService = {
    createCommentByPostId: async (payload: CreateUpdateCommentInputModel, postId: string, userId: string) => {
        const post = await postsRepository.findPostById(new ObjectId(postId));

        if (!post) {
            return null;
        }

        const user = await usersRepository.findUserById(new ObjectId(userId));

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
};
