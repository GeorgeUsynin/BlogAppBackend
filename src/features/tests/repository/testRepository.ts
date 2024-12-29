import {
    usersCollection,
    commentsCollection,
    apiRateLimitCollection,
    authDeviceSessionsCollection,
} from '../../../database/mongoDB';
import { BlogModel } from '../../blogs/domain';
import { PostModel } from '../../posts/domain';

export const testRepository = {
    async deleteAllData() {
        await BlogModel.deleteMany({});
        await PostModel.deleteMany({});
        await commentsCollection.deleteMany({});
        await usersCollection.deleteMany({});
        await apiRateLimitCollection.deleteMany({});
        await authDeviceSessionsCollection.deleteMany({});
    },
};
