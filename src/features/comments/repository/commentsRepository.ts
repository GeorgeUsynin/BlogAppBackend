import { CommentDocument, CommentModel, TComment } from '../domain';
import { CreateUpdateCommentInputModel } from '../models';

export class CommentsRepository {
    async createComment(newComment: TComment) {
        return CommentModel.create(newComment);
    }

    async findCommentById(id: string) {
        return CommentModel.findById(id);
    }

    async updateComment(id: string, payload: CreateUpdateCommentInputModel) {
        return CommentModel.findByIdAndUpdate(id, payload, { lean: true, new: true });
    }

    async deleteCommentById(id: string) {
        return CommentModel.findByIdAndDelete(id);
    }

    async saveComment(commentDocument: CommentDocument) {
        return commentDocument.save();
    }
}
