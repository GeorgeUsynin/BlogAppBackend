import { commentsCollection, TDatabase } from '../../../database/mongoDB';

export const commentsRepository = {
    //@ts-expect-error since ObjectId will be created by MongoDB we don't need to pass it
    createComment: async (newComment: Omit<TDatabase.TComment, '_id'>) => commentsCollection.insertOne(newComment),
};
