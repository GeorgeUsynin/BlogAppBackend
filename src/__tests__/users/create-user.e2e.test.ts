import { request, createErrorMessages, getAuthorization, dbHelper } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { CreateUserInputModel, UserItemViewModel } from '../../features/users/models';
import { users } from '../dataset';

describe('create a user', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['users']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('creates a new user', async () => {
        const newUser: CreateUserInputModel = {
            login: 'george',
            email: 'user1george@example.com',
            password: '12345678',
        };

        const createdUser: UserItemViewModel = {
            id: expect.any(String),
            createdAt: expect.any(String),
            login: expect.any(String),
            email: expect.any(String),
        };

        //creating new user
        const { body: newUserBodyResponse } = await request
            .post(ROUTES.USERS)
            .set(getAuthorization())
            .send(newUser)
            .expect(HTTP_STATUS_CODES.CREATED_201);

        expect(newUserBodyResponse).toEqual(createdUser);

        //checking that the user was created
        const { body: allUsersBodyResponse } = await request
            .get(ROUTES.USERS)
            .set(getAuthorization())
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(allUsersBodyResponse.items).toEqual([createdUser]);
    });

    describe('user payload validation', () => {
        beforeEach(async () => {
            await dbHelper.setDb({ users });
        });

        describe('login', () => {
            it('returns 400 status code and proper error object if `login` is missing', async () => {
                //@ts-expect-error bad request (login is missing)
                const newUser: CreateUserInputModel = {
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `login` is empty or contain only spaces', async () => {
                const newUser: CreateUserInputModel = {
                    login: ' ',
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `login` type', async () => {
                const newUser: CreateUserInputModel = {
                    //@ts-expect-error bad request (login type is invalid)
                    login: [],
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `login` min length', async () => {
                const newUser: CreateUserInputModel = {
                    login: 'ab',
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['minMaxLength'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `login` max length', async () => {
                const newUser: CreateUserInputModel = {
                    login: 'More than ten characters',
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['minMaxLength'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `login` pattern', async () => {
                const newUser: CreateUserInputModel = {
                    login: 'my login',
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['isPattern'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `login` is not unique', async () => {
                const newUser: CreateUserInputModel = {
                    login: 'george',
                    email: 'george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['isUnique'] })).toEqual(body);
            });
        });

        describe('email', () => {
            it('returns 400 status code and proper error object if `email` is missing', async () => {
                //@ts-expect-error bad request (email is missing)
                const newUser: CreateUserInputModel = {
                    login: 'george',
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ email: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `email` is empty or contain only spaces', async () => {
                const newUser: CreateUserInputModel = {
                    login: 'george',
                    email: ' ',
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ email: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `email` type', async () => {
                const newUser: CreateUserInputModel = {
                    login: 'george',
                    //@ts-expect-error bad request (email type is invalid)
                    email: [],
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ email: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `email` pattern', async () => {
                const newUser: CreateUserInputModel = {
                    login: 'george',
                    email: 'user1george@',
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ email: ['isPattern'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `email` is not unique', async () => {
                const newUser: CreateUserInputModel = {
                    login: 'olga',
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ email: ['isUnique'] })).toEqual(body);
            });
        });

        describe('password', () => {
            it('returns 400 status code and proper error object if `password` is missing', async () => {
                //@ts-expect-error bad request (password is missing)
                const newUser: CreateUserInputModel = {
                    login: 'george',
                    email: 'user1george@example.com',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ password: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `password` is empty or contain only spaces', async () => {
                const newUser: CreateUserInputModel = {
                    login: 'george',
                    email: 'user1george@example.com',
                    password: ' ',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ password: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `password` type', async () => {
                const newUser: CreateUserInputModel = {
                    login: 'george',
                    //@ts-expect-error bad request (password type is invalid)
                    password: [],
                    email: 'user1george@example.com',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ password: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `password` min length', async () => {
                const newUser: CreateUserInputModel = {
                    login: 'george',
                    email: 'user1george@example.com',
                    password: '12345',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ password: ['minMaxLength'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `password` max length', async () => {
                const newUser: CreateUserInputModel = {
                    login: 'olga',
                    email: 'user1olgae@example.com',
                    password: '12345678901234567890122',
                };
                const { body } = await request
                    .post(ROUTES.USERS)
                    .set(getAuthorization())
                    .send(newUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ password: ['minMaxLength'] })).toEqual(body);
            });
        });
    });

    it('returns 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const newUser: CreateUserInputModel = {
            login: 'george',
            email: 'user1george@example.com',
            password: '12345678',
        };

        await request.post(ROUTES.USERS).send(newUser).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
