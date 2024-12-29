import { apiRateLimitCollection } from '../../../database/mongoDB';
import { BlogModel } from '../../blogs/domain';
import { CommentModel } from '../../comments/domain';
import { PostModel } from '../../posts/domain';
import { AuthDeviceSessionModel } from '../../security/domain';
import { UserModel } from '../../users/domain';

export const testRepository = {
    async deleteAllData() {
        await BlogModel.deleteMany({});
        await PostModel.deleteMany({});
        await CommentModel.deleteMany({});
        await UserModel.deleteMany({});
        await apiRateLimitCollection.deleteMany({});
        await AuthDeviceSessionModel.deleteMany({});
    },
};
