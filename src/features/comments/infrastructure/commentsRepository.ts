import { injectable } from 'inversify';
import { CommentDocument, CommentModel, TComment } from '../domain';

@injectable()
export class CommentsRepository {
    async findCommentById(id: string) {
        return CommentModel.findById(id);
    }

    async save(commentDocument: CommentDocument) {
        return commentDocument.save();
    }
}
