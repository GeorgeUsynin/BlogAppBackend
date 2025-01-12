import { HydratedDocument, Model } from 'mongoose';
import { APIRateLimitStatics } from './APIRateLimitEntity';

export type TAPIRateLimit = {
    IP: string;
    URL: string;
    date: Date;
};

type TAPIRateLimitStatics = typeof APIRateLimitStatics;

export type TAPIRateLimitModel = Model<TAPIRateLimit> & TAPIRateLimitStatics;

export type APIRateLimitDocument = HydratedDocument<TAPIRateLimit>;
