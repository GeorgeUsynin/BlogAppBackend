import { BlogModel } from '../../blogs/domain';
import { CommentModel } from '../../comments/domain';
import { PostModel } from '../../posts/domain';
import { AuthDeviceSessionModel } from '../../security/domain';
import { ApiRateLimitModel } from '../../apiRateLimit/domain';
import { UserModel } from '../../users/domain';
import { LikeModel } from '../../likes/domain';

export const testRepository = {
    async deleteAllData() {
        await BlogModel.deleteMany({});
        await PostModel.deleteMany({});
        await CommentModel.deleteMany({});
        await UserModel.deleteMany({});
        await ApiRateLimitModel.deleteMany({});
        await AuthDeviceSessionModel.deleteMany({});
        await LikeModel.deleteMany({});
    },
};
