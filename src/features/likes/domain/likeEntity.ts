import { model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';
import { LikeStatus } from '../../../constants';
import { LikeDocument, TLike, TLikeModel } from './types';
import { CreateLikeDTO } from '../application/dto';

const likeSchema = new Schema<TLike>({
    userId: { type: String, required: true },
    parentId: { type: String, required: true },
    status: { type: String, enum: LikeStatus, required: true },
});

export const likeStatics = {
    createLike(dto: CreateLikeDTO) {
        const newLike = new LikeModel(dto);

        return newLike;
    },
};

export const likeMethods = {
    canBeUpdated(status: keyof typeof LikeStatus) {
        const that = this as LikeDocument;

        return that.status !== status;
    },
};

likeSchema.statics = likeStatics;
likeSchema.methods = likeMethods;

export const LikeModel = model<TLike, TLikeModel>(SETTINGS.DB_COLLECTIONS.likesCollection, likeSchema);
