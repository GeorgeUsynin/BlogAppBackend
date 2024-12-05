import { blogsCollection, postsCollection, usersCollection, commentsCollection } from '../../../database/mongoDB';

export const testRepository = {
    deleteAllData: async () => {
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
        await commentsCollection.deleteMany({});
        await usersCollection.deleteMany({});
    },
};
