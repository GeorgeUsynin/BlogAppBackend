import { blogsCollection, postsCollection } from '../../../database/mongoDB';

export const testRepository = {
    deleteAllData: async () => {
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
    },
};
