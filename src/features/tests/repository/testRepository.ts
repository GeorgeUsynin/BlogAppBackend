import { usersCollection, apiRateLimitCollection, authDeviceSessionsCollection } from '../../../database/mongoDB';
import { BlogModel } from '../../blogs/domain';
import { CommentModel } from '../../comments/domain';
import { PostModel } from '../../posts/domain';

export const testRepository = {
    async deleteAllData() {
        await BlogModel.deleteMany({});
        await PostModel.deleteMany({});
        await CommentModel.deleteMany({});
        await usersCollection.deleteMany({});
        await apiRateLimitCollection.deleteMany({});
        await authDeviceSessionsCollection.deleteMany({});
    },
};
