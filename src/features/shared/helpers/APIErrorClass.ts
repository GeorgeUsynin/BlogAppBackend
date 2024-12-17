import { ResultStatus } from '../../../constants';

interface APIErrorConstructor {
    status: ResultStatus;
    message: string;
    field?: string;
}

export class APIError extends Error {
    status: ResultStatus;
    message: string;
    field: string;

    constructor({ status, message, field = '' }: APIErrorConstructor) {
        super();
        this.message = message;
        this.status = status;
        this.field = field;
    }

    getError() {
        return {
            status: this.status,
            errorsMessages: [{ field: this.field, message: this.message }],
        };
    }
}
