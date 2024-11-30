import { createErrorMessages, dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { LoginInputModel } from '../../features/auth/models';
import { users } from '../dataset';

describe('login', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ users });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['users']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('returns 204 No Content status code if login/email and password are correct', async () => {
        const credentialsWithLogin: LoginInputModel = {
            loginOrEmail: 'george',
            password: '12345678',
        };

        await request.post(ROUTES.LOGIN).send(credentialsWithLogin).expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const credentialsWithEmail: LoginInputModel = {
            loginOrEmail: 'user1george@example.com',
            password: '12345678',
        };

        await request.post(ROUTES.LOGIN).send(credentialsWithEmail).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
    });

    describe('login payload validation', () => {
        describe('loginOrEmail', () => {
            it('returns 400 status code and proper error object if `loginOrEmail` is missing', async () => {
                //@ts-expect-error bad request (loginOrEmail is missing)
                const credentials: LoginInputModel = {
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.LOGIN)
                    .send(credentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `loginOrEmail` is empty or contain only spaces', async () => {
                const credentials: LoginInputModel = {
                    loginOrEmail: ' ',
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.LOGIN)
                    .send(credentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ loginOrEmail: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `loginOrEmail` type', async () => {
                const credentials: LoginInputModel = {
                    //@ts-expect-error bad request (loginOrEmail type is invalid)
                    loginOrEmail: [],
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.LOGIN)
                    .send(credentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ loginOrEmail: ['isString'] })).toEqual(body);
            });
        });

        describe('password', () => {
            it('returns 400 status code and proper error object if `password` is missing', async () => {
                //@ts-expect-error bad request (password is missing)
                const credentials: LoginInputModel = {
                    loginOrEmail: 'george',
                };
                const { body } = await request
                    .post(ROUTES.LOGIN)
                    .send(credentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ password: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `password` is empty or contain only spaces', async () => {
                const credentials: LoginInputModel = {
                    loginOrEmail: 'george',
                    password: ' ',
                };
                const { body } = await request
                    .post(ROUTES.LOGIN)
                    .send(credentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ password: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `password` type', async () => {
                const credentials: LoginInputModel = {
                    loginOrEmail: 'george',
                    //@ts-expect-error bad request (password type is invalid)
                    password: [],
                };
                const { body } = await request
                    .post(ROUTES.LOGIN)
                    .send(credentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ password: ['isString'] })).toEqual(body);
            });
        });
    });

    it('returns 401 Unauthorized status code if the password or login is wrong', async () => {
        const credentialsWithWrongLogin: LoginInputModel = {
            loginOrEmail: 'olga',
            password: '12345678',
        };

        await request.post(ROUTES.LOGIN).send(credentialsWithWrongLogin).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

        const credentialsWithWrongPassword: LoginInputModel = {
            loginOrEmail: 'george',
            password: '12345679',
        };

        await request.post(ROUTES.LOGIN).send(credentialsWithWrongPassword).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});