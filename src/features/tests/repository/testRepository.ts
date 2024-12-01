import { blogsCollection, postsCollection, usersCollection } from '../../../database/mongoDB';

export const testRepository = {
    deleteAllData: async () => {
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
        await usersCollection.deleteMany({});
    },
};
