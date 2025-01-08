import { createErrorMessages, dbHelper, delay, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { NewPasswordInputDTO } from '../../features/auth/application';
import { users } from '../dataset';

describe('new password', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ users });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['users', 'apiRateLimit']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('returns status NoContent 204 if password is changed successfully', async () => {
        const creds = {
            loginOrEmail: 'george',
            password: '12345678',
        };

        await request.post(`${ROUTES.AUTH}${ROUTES.LOGIN}`).send(creds).expect(HTTP_STATUS_CODES.OK_200);

        const payload: NewPasswordInputDTO = {
            newPassword: '76543210',
            recoveryCode: '334455',
        };

        await request
            .post(`${ROUTES.AUTH}${ROUTES.NEW_PASSWORD}`)
            .send(payload)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const newCreds = {
            loginOrEmail: 'george',
            password: '76543210',
        };

        await request.post(`${ROUTES.AUTH}${ROUTES.LOGIN}`).send(newCreds).expect(HTTP_STATUS_CODES.OK_200);
    });

    describe('password change payload validation', () => {
        describe('newPassword', () => {
            it('returns 400 status code and proper error object if `newPassword` is missing', async () => {
                //@ts-expect-error bad request (newPassword is missing)
                const payload: NewPasswordInputDTO = {
                    recoveryCode: '334455',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.NEW_PASSWORD}`)
                    .send(payload)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ newPassword: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `newPassword` is empty or contain only spaces', async () => {
                const payload: NewPasswordInputDTO = {
                    newPassword: ' ',
                    recoveryCode: '334455',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.NEW_PASSWORD}`)
                    .send(payload)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ newPassword: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `password` type', async () => {
                const payload: NewPasswordInputDTO = {
                    //@ts-expect-error bad request (newPassword type is invalid)
                    newPassword: [],
                    recoveryCode: '334455',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.NEW_PASSWORD}`)
                    .send(payload)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ newPassword: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `newPassword` min length', async () => {
                const payload: NewPasswordInputDTO = {
                    newPassword: '12345',
                    recoveryCode: '334455',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.NEW_PASSWORD}`)
                    .send(payload)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ newPassword: ['minMaxLength'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `newPassword` max length', async () => {
                const payload: NewPasswordInputDTO = {
                    newPassword: '12345678901234567890122',
                    recoveryCode: '334455',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.NEW_PASSWORD}`)
                    .send(payload)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ newPassword: ['minMaxLength'] })).toEqual(body);
            });
        });

        describe('recoveryCode', () => {
            it('returns 400 status code and proper error object if `recoveryCode` is missing', async () => {
                //@ts-expect-error bad request (recoveryCode is missing)
                const payload: NewPasswordInputDTO = {
                    newPassword: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.NEW_PASSWORD}`)
                    .send(payload)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ recoveryCode: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `recoveryCode` is empty or contain only spaces', async () => {
                const payload: NewPasswordInputDTO = {
                    newPassword: '12345678',
                    recoveryCode: ' ',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.NEW_PASSWORD}`)
                    .send(payload)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ recoveryCode: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `recoveryCode` type', async () => {
                const payload: NewPasswordInputDTO = {
                    //@ts-expect-error bad request (recoveryCode type is invalid)
                    recoveryCode: [],
                    newPassword: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.NEW_PASSWORD}`)
                    .send(payload)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ recoveryCode: ['isString'] })).toEqual(body);
            });
        });
    });

    it('returns 400 status code and proper error object if `recoveryCode` is not found in the database', async () => {
        const payload: NewPasswordInputDTO = {
            newPassword: '12345678',
            recoveryCode: '654321123456',
        };

        const { body } = await request
            .post(`${ROUTES.AUTH}${ROUTES.NEW_PASSWORD}`)
            .send(payload)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        expect({ errorsMessages: [{ field: 'recoveryCode', message: 'Invalid code' }] }).toEqual(body);
    });

    it('returns 400 status code and proper error object if `recoveryCode` is expired', async () => {
        const payload: NewPasswordInputDTO = {
            newPassword: '12345678',
            recoveryCode: '111111',
        };

        await delay(600);

        const { body } = await request
            .post(`${ROUTES.AUTH}${ROUTES.NEW_PASSWORD}`)
            .send(payload)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        expect({ errorsMessages: [{ field: 'recoveryCode', message: 'Code expired' }] }).toEqual(body);
    });
});
