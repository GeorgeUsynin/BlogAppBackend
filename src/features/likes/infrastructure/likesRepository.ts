import { injectable } from 'inversify';
import { LikeStatus } from '../../../constants';
import { LikeDocument, LikeModel, TLike } from '../domain';

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

    async save(likeDocument: LikeDocument) {
        return likeDocument.save();
    }
}
