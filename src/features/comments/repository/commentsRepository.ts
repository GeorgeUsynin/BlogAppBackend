import { ObjectId } from 'mongodb';
import { CreateUpdateCommentInputModel } from '../models';
import { CommentModel, TComment } from '../domain';

export const commentsRepository = {
    async createComment(newComment: TComment) {
        return CommentModel.create(newComment);
    },
    async findCommentById(id: string) {
        return CommentModel.findById(id);
    },
    async updateComment(id: string, payload: CreateUpdateCommentInputModel) {
        return CommentModel.findByIdAndUpdate(id, payload, { lean: true, new: true });
    },
    async deleteCommentById(id: string) {
        return CommentModel.findByIdAndDelete(id);
    },
};
