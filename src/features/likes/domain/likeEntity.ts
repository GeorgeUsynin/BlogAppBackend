import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';
import { LikeStatus } from '../../../constants';

export type TLike = {
    status: keyof typeof LikeStatus;
    userId: string;
    parentId: string;
};

type TLikeModel = Model<TLike>;

export type LikeDocument = HydratedDocument<TLike>;

const likeSchema = new Schema<TLike>({
    userId: { type: String, required: true },
    parentId: { type: String, required: true },
    status: { type: String, enum: LikeStatus, required: true },
});

export const LikeModel = model<TLike, TLikeModel>(SETTINGS.DB_COLLECTIONS.likesCollection, likeSchema);
