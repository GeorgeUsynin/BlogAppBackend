import { APIError } from '../helpers';
import { ResultStatus } from '../../../constants';
import { APIRateLimitRepository } from '../repository';
import { TAPIRateLimit } from './APIRateLimitEntity';

export class APIRateLimitService {
    constructor(private APIRateLimitRepository: APIRateLimitRepository) {}

    async logApiRequest(payload: TAPIRateLimit) {
        const totalCountOfFilteredAPIRequests = await this.APIRateLimitRepository.getTotalCountOfFilteredAPIRequests(
            payload
        );

        if (totalCountOfFilteredAPIRequests === 5) {
            throw new APIError({
                status: ResultStatus.RateLimit,
                message: 'Too many requests! Please wait for 10 seconds',
            });
        }

        await this.APIRateLimitRepository.addAPIRequest(payload);
    }
}
