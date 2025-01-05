import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';
import { LikeStatus } from '../../../constants';

type TLikeValues = {
    status: keyof typeof LikeStatus;
    userId: string;
    parentId: string;
};

export class TLike {
    public status: keyof typeof LikeStatus;
    public userId: string;
    public parentId: string;

    constructor(values: TLikeValues) {
        this.status = values.status;
        this.userId = values.userId;
        this.parentId = values.parentId;
    }
}

type TLikeModel = Model<TLike>;

export type LikeDocument = HydratedDocument<TLike>;

const likeSchema = new Schema<TLike>({
    userId: { type: String, required: true },
    parentId: { type: String, required: true },
    status: { type: String, enum: LikeStatus, required: true },
});

export const LikeModel = model<TLike, TLikeModel>(SETTINGS.DB_COLLECTIONS.likesCollection, likeSchema);
