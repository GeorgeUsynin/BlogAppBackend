import nodemailer from 'nodemailer';
import { createErrorMessages, dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { users } from '../dataset';
import { RegistrationInputDTO } from '../../features/auth/application';

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockImplementation((email, subject, message) => Promise.resolve()),
    }),
}));

describe('registration', () => {
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

    it('returns status NoContent 204 if registration is successful', async () => {
        const credentials: RegistrationInputDTO = {
            login: 'angiejo03',
            password: '12345678',
            email: 'angiejo03@example.com',
        };

        await request
            .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
            .send(credentials)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_BLOG_PLATFORM,
                pass: process.env.EMAIL_BLOG_PLATFORM_PASSWORD,
            },
        });

        expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(1);
        expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                from: `Blog Platform <${process.env.EMAIL_BLOG_PLATFORM}>`,
                to: credentials.email,
                subject: 'Password Confirmation',
                html: expect.stringContaining('code'),
            })
        );
    });

    describe('registration payload validation', () => {
        describe('login', () => {
            it('returns 400 status code and proper error object if `login` is missing', async () => {
                //@ts-expect-error bad request (login is missing)
                const newCredentials: RegistrationInputDTO = {
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `login` is empty or contain only spaces', async () => {
                const newCredentials: RegistrationInputDTO = {
                    login: ' ',
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `login` type', async () => {
                const newCredentials: RegistrationInputDTO = {
                    //@ts-expect-error bad request (login type is invalid)
                    login: [],
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `login` min length', async () => {
                const newCredentials: RegistrationInputDTO = {
                    login: 'ab',
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['minMaxLength'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `login` max length', async () => {
                const newCredentials: RegistrationInputDTO = {
                    login: 'More than ten characters',
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['minMaxLength'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `login` pattern', async () => {
                const newCredentials: RegistrationInputDTO = {
                    login: 'my login',
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ login: ['isPattern'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `login` is not unique', async () => {
                const newCredentials: RegistrationInputDTO = {
                    login: 'george',
                    email: 'george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect({
                    errorsMessages: [{ field: 'login', message: 'User with this login already exists' }],
                }).toEqual(body);
            });
        });

        describe('email', () => {
            it('returns 400 status code and proper error object if `email` is missing', async () => {
                //@ts-expect-error bad request (email is missing)
                const newCredentials: RegistrationInputDTO = {
                    login: 'george',
                    password: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ email: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `email` is empty or contain only spaces', async () => {
                const newCredentials: RegistrationInputDTO = {
                    login: 'george',
                    email: ' ',
                    password: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ email: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `email` type', async () => {
                const newCredentials: RegistrationInputDTO = {
                    login: 'george',
                    //@ts-expect-error bad request (email type is invalid)
                    email: [],
                    password: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ email: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `email` pattern', async () => {
                const newCredentials: RegistrationInputDTO = {
                    login: 'george',
                    email: 'user1george@',
                    password: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ email: ['isPattern'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `email` is not unique', async () => {
                const newCredentials: RegistrationInputDTO = {
                    login: 'olga',
                    email: 'user1george@example.com',
                    password: '12345678',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect({
                    errorsMessages: [{ field: 'email', message: 'User with this email already exists' }],
                }).toEqual(body);
            });
        });

        describe('password', () => {
            it('returns 400 status code and proper error object if `password` is missing', async () => {
                //@ts-expect-error bad request (password is missing)
                const newCredentials: RegistrationInputDTO = {
                    login: 'george',
                    email: 'user1george@example.com',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ password: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `password` is empty or contain only spaces', async () => {
                const newCredentials: RegistrationInputDTO = {
                    login: 'george',
                    email: 'user1george@example.com',
                    password: ' ',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ password: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `password` type', async () => {
                const newCredentials: RegistrationInputDTO = {
                    login: 'george',
                    //@ts-expect-error bad request (password type is invalid)
                    password: [],
                    email: 'user1george@example.com',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ password: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `password` min length', async () => {
                const newCredentials: RegistrationInputDTO = {
                    login: 'george',
                    email: 'user1george@example.com',
                    password: '12345',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ password: ['minMaxLength'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `password` max length', async () => {
                const newCredentials: RegistrationInputDTO = {
                    login: 'olga',
                    email: 'user1olgae@example.com',
                    password: '12345678901234567890122',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.REGISTRATION}`)
                    .send(newCredentials)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ password: ['minMaxLength'] })).toEqual(body);
            });
        });
    });
});
