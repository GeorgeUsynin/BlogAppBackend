import { blogsCollection, postsCollection, usersCollection, commentsCollection } from '../../../database/mongoDB';

export const testRepository = {
    async deleteAllData() {
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
        await commentsCollection.deleteMany({});
        await usersCollection.deleteMany({});
    },
};
