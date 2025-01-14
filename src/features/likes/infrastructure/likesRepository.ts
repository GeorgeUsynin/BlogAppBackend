import { injectable } from 'inversify';
import { LikeDocument, LikeModel } from '../domain';

type TParams = {
    parentId?: string;
    userId?: string;
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
