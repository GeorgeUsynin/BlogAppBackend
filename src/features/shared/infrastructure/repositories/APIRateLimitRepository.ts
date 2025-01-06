import { SETTINGS } from '../../../../app-settings';
import { ApiRateLimitModel, TAPIRateLimit } from '../../application/services';

export class APIRateLimitRepository {
    async addAPIRequest(payload: TAPIRateLimit) {
        return ApiRateLimitModel.create(payload);
    }

    async getTotalCountOfFilteredAPIRequests(payload: TAPIRateLimit) {
        const { IP, URL, date } = payload;

        const filter = {
            $and: [
                { IP },
                { URL },
                { date: { $gte: new Date(date.getTime() - SETTINGS.API_RATE_LIMIT_TIME_GAP_IN_MILLISECONDS) } },
            ],
        };

        return ApiRateLimitModel.countDocuments(filter);
    }
}
