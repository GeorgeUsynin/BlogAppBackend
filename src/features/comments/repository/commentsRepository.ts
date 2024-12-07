import { ObjectId } from 'mongodb';
import { commentsCollection, TDatabase } from '../../../database/mongoDB';
import { CreateUpdateCommentInputModel } from '../models';

export const commentsRepository = {
    //@ts-expect-error since ObjectId will be created by MongoDB we don't need to pass it
    createComment: async (newComment: Omit<TDatabase.TComment, '_id'>) => commentsCollection.insertOne(newComment),
    findCommentById: async (id: string) => commentsCollection.findOne({ _id: new ObjectId(id) }),
    updateComment: async (id: string, payload: CreateUpdateCommentInputModel) =>
        commentsCollection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...payload } }),
    deleteCommentById: async (id: string) => commentsCollection.findOneAndDelete({ _id: new ObjectId(id) }),
};
