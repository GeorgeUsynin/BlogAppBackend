import { APIError } from '../helpers';
import { ResultStatus } from '../../../constants';
import { APIRateLimitRepository } from '../repository';
import { TAPIRateLimit } from './APIRateLimitEntity';

export const APIRateLimitService = {
    async logApiRequest(payload: TAPIRateLimit) {
        const totalCountOfFilteredAPIRequests = await APIRateLimitRepository.getTotalCountOfFilteredAPIRequests(
            payload
        );

        if (totalCountOfFilteredAPIRequests === 5) {
            throw new APIError({
                status: ResultStatus.RateLimit,
                message: 'Too many requests! Please wait for 10 seconds',
            });
        }

        await APIRateLimitRepository.addAPIRequest(payload);
    },
};
