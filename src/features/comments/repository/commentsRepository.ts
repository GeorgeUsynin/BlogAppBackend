import { ObjectId } from 'mongodb';
import { commentsCollection, TDatabase } from '../../../database/mongoDB';
import { CreateUpdateCommentInputModel } from '../models';

export const commentsRepository = {
    async createComment(newComment: Omit<TDatabase.TComment, '_id'>) {
        //@ts-expect-error since ObjectId will be created by MongoDB we don't need to pass it
        return commentsCollection.insertOne(newComment);
    },
    async findCommentById(id: string) {
        return commentsCollection.findOne({ _id: new ObjectId(id) });
    },
    async updateComment(id: string, payload: CreateUpdateCommentInputModel) {
        return commentsCollection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...payload } });
    },
    async deleteCommentById(id: string) {
        return commentsCollection.findOneAndDelete({ _id: new ObjectId(id) });
    },
};
