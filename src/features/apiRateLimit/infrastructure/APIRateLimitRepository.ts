import { SETTINGS } from '../../../app-settings';
import { APIRateLimitDocument, ApiRateLimitModel, TAPIRateLimit } from '../domain';

export class APIRateLimitRepository {
    async save(apiRateLimitRequest: APIRateLimitDocument) {
        return apiRateLimitRequest.save();
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
