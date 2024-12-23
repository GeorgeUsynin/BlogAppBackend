import { createErrorMessages, dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { RegistrationConfirmationInputModel } from '../../features/auth/models';
import { users } from '../dataset';

describe('registration confirmation', () => {
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

    it('returns status NoContent 204 if registration confirmation is successful', async () => {
        const code: RegistrationConfirmationInputModel = {
            code: '654321',
        };

        await request
            .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION_CONFIRMATION}`)
            .send(code)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const user = await dbHelper.getUser(4);
        expect(user.emailConfirmation.isConfirmed).toBe(true);
    });

    describe('registration confirmation payload validation', () => {
        describe('code', () => {
            it('returns 400 status code and proper error object if `code` is missing', async () => {
                //@ts-expect-error bad request (code is missing)
                const newCode: RegistrationConfirmationInputModel = {};
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION_CONFIRMATION}`)
                    .send(newCode)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ code: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `code` is empty or contain only spaces', async () => {
                const newCode: RegistrationConfirmationInputModel = {
                    code: ' ',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION_CONFIRMATION}`)
                    .send(newCode)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ code: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `code` type', async () => {
                const newCode: RegistrationConfirmationInputModel = {
                    //@ts-expect-error bad request (code type is invalid)
                    code: [],
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION_CONFIRMATION}`)
                    .send(newCode)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ code: ['isString'] })).toEqual(body);
            });
        });
    });

    it('returns 400 status code and proper error object if `code` is not found in the database', async () => {
        const code: RegistrationConfirmationInputModel = {
            code: '654321123456',
        };

        const { body } = await request
            .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION_CONFIRMATION}`)
            .send(code)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        expect({ errorsMessages: [{ field: 'code', message: 'Invalid code' }] }).toEqual(body);
    });

    it('returns 400 status code and proper error object if `code` is already confirmed', async () => {
        const code: RegistrationConfirmationInputModel = {
            code: '321456',
        };

        const { body } = await request
            .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION_CONFIRMATION}`)
            .send(code)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        expect({ errorsMessages: [{ field: 'code', message: 'Email already confirmed' }] }).toEqual(body);
    });

    it('returns 400 status code and proper error object if `code` is expired', async () => {
        const code: RegistrationConfirmationInputModel = {
            code: '111111',
        };

        await new Promise(resolve => setTimeout(resolve, 600));

        const { body } = await request
            .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION_CONFIRMATION}`)
            .send(code)
            .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

        expect({ errorsMessages: [{ field: 'code', message: 'Code expired' }] }).toEqual(body);
    });
});
