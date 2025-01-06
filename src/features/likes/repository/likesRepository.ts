import { injectable } from 'inversify';
import { LikeStatus } from '../../../constants';
import { LikeDocument, LikeModel } from '../domain';

type TParams = {
    parentId?: string;
    userId?: string;
};

type TPayload = {
    parentId: string;
    userId: string;
    likeStatus: keyof typeof LikeStatus;
};

@injectable()
export class LikesRepository {
    async findLikeByParams(params: TParams) {
        return LikeModel.findOne({ $and: [params] });
    }

    async createLike(payload: TPayload) {
        const { parentId, likeStatus, userId } = payload;

        return LikeModel.create({ parentId, userId, status: likeStatus });
    }

    async saveLike(likeDocument: LikeDocument) {
        return likeDocument.save();
    }
}
