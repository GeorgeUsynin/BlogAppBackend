import {
    postsCollection,
    usersCollection,
    commentsCollection,
    apiRateLimitCollection,
    authDeviceSessionsCollection,
} from '../../../database/mongoDB';
import { BlogModel } from '../../blogs/domain';

export const testRepository = {
    async deleteAllData() {
        await BlogModel.deleteMany({});
        await postsCollection.deleteMany({});
        await commentsCollection.deleteMany({});
        await usersCollection.deleteMany({});
        await apiRateLimitCollection.deleteMany({});
        await authDeviceSessionsCollection.deleteMany({});
    },
};
