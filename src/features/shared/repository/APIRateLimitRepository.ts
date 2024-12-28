import { SETTINGS } from '../../../app-settings';
import { apiRateLimitCollection, TDatabase } from '../../../database';

export const APIRateLimitRepository = {
    async addAPIRequest(payload: TDatabase.TAPIRateLimit) {
        return apiRateLimitCollection.insertOne(payload);
    },
    async getTotalCountOfFilteredAPIRequests(payload: TDatabase.TAPIRateLimit) {
        const { IP, URL, date } = payload;

        const filter = {
            $and: [
                { IP },
                { URL },
                { date: { $gte: new Date(date.getTime() - SETTINGS.API_RATE_LIMIT_TIME_GAP_IN_MILLISECONDS) } },
            ],
        };

        return apiRateLimitCollection.countDocuments(filter);
    },
};
