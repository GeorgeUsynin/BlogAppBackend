import { model, Schema } from 'mongoose';
import { SETTINGS } from '../../../app-settings';
import { TAPIRateLimit, TAPIRateLimitModel } from './types';
import { CreateAPIRateLimitDTO } from './dto';

const APIRateLimitSchema = new Schema<TAPIRateLimit>({
    IP: { type: String, required: true },
    URL: { type: String, required: true },
    date: { type: Date, required: true },
});

export const APIRateLimitStatics = {
    createAPIRateLimit(dto: CreateAPIRateLimitDTO) {
        const newAPIRateLImit = new ApiRateLimitModel(dto);

        return newAPIRateLImit;
    },
};

APIRateLimitSchema.statics = APIRateLimitStatics;

export const ApiRateLimitModel = model<TAPIRateLimit, TAPIRateLimitModel>(
    SETTINGS.DB_COLLECTIONS.apiRateLimitCollection,
    APIRateLimitSchema
);
