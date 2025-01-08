import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';

export type TAPIRateLimit = {
    IP: string;
    URL: string;
    date: Date;
};

type TAPIRateLimitModel = Model<TAPIRateLimit>;

export type APIRateLimitDocument = HydratedDocument<TAPIRateLimit>;

const APIRateLimitSchema = new Schema<TAPIRateLimit>({
    IP: { type: String, required: true },
    URL: { type: String, required: true },
    date: { type: Date, required: true },
});

export const ApiRateLimitModel = model<TAPIRateLimit, TAPIRateLimitModel>(
    SETTINGS.DB_COLLECTIONS.apiRateLimitCollection,
    APIRateLimitSchema
);
