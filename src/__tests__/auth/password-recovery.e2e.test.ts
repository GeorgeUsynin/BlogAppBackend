import nodemailer from 'nodemailer';
import { createErrorMessages, dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { PasswordRecoveryInputModel } from '../../features/auth/models';
import { users } from '../dataset';

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockImplementation((email, subject, message) => Promise.resolve()),
    }),
}));

describe('password recovery', () => {
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

    it('returns status NoContent 204 if password recovery is successful for existing email', async () => {
        const email: PasswordRecoveryInputModel = {
            email: 'angiejo04@example.com',
        };

        await request
            .post(`${ROUTES.AUTH}${ROUTES.PASSWORD_RECOVERY}`)
            .send(email)
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
                to: email.email,
                subject: 'Password Recovery',
                html: expect.stringContaining('recoveryCode'),
            })
        );
    });

    it('returns status NoContent 204 if password recovery is successful for non-existing email', async () => {
        const email: PasswordRecoveryInputModel = {
            email: 'example@example.com',
        };

        await request
            .post(`${ROUTES.AUTH}${ROUTES.PASSWORD_RECOVERY}`)
            .send(email)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);
    });

    describe('password recovery payload validation', () => {
        describe('email', () => {
            it('returns 400 status code and proper error object if `email` is missing', async () => {
                //@ts-expect-error bad request (email is missing)
                const email: PasswordRecoveryInputModel = {};
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.PASSWORD_RECOVERY}`)
                    .send(email)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ email: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `email` is empty or contain only spaces', async () => {
                const email: PasswordRecoveryInputModel = {
                    email: ' ',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.PASSWORD_RECOVERY}`)
                    .send(email)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ email: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `email` type', async () => {
                const email: PasswordRecoveryInputModel = {
                    //@ts-expect-error bad request (email type is invalid)
                    email: [],
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.PASSWORD_RECOVERY}`)
                    .send(email)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ email: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `email` pattern', async () => {
                const email: PasswordRecoveryInputModel = {
                    email: 'user1george@',
                };
                const { body } = await request
                    .post(`${ROUTES.AUTH}${ROUTES.PASSWORD_RECOVERY}`)
                    .send(email)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ email: ['isPattern'] })).toEqual(body);
            });
        });
    });
});
