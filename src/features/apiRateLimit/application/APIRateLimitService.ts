import { inject } from 'inversify';
import { APIError } from '../../shared/helpers';
import { ResultStatus } from '../../../constants';
import { APIRateLimitRepository } from '../infrastructure';
import { ApiRateLimitModel, TAPIRateLimit } from '../domain';

export class APIRateLimitService {
    constructor(@inject(APIRateLimitRepository) private APIRateLimitRepository: APIRateLimitRepository) {}

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

        const newAPIRateLimitRequest = new ApiRateLimitModel(payload);
        await this.APIRateLimitRepository.save(newAPIRateLimitRequest);
    }
}
