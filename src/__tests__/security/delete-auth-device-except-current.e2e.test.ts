import { dbHelper, delay, generateRefreshTokenCookie, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { users, authDeviceSessions, fakeRequestedObjectId } from '../dataset';
import { LoginInputModel } from '../../features/auth/models/LoginInputModel';
import { AuthDeviceViewModel } from '../../features/security/models';

describe('delete auth device except current', () => {
    let loginRefreshTokenCookie: { Cookie: string[] };

    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ authDeviceSessions, users });

        // create login refresh token using login credentials
        const credentialsWithLogin: LoginInputModel = {
            loginOrEmail: 'george',
            password: '12345678',
        };

        const loginResponse = await request
            .post(`${ROUTES.AUTH}${ROUTES.LOGIN}`)
            .send(credentialsWithLogin)
            .expect(HTTP_STATUS_CODES.OK_200);

        const loginRefreshTokenMatch = loginResponse.headers['set-cookie'][0].match(/refreshToken=([^;]+)/);
        const loginRefreshToken = loginRefreshTokenMatch?.[1] as string;

        loginRefreshTokenCookie = { Cookie: [`refreshToken=${loginRefreshToken}; Path=/; HttpOnly; Secure`] };
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['users', 'apiRateLimit', 'authDeviceSessions']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('deletes all auth devices except current', async () => {
        await request
            .delete(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body }: { body: AuthDeviceViewModel[] } = await request
            .get(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(body.length).toBe(1);
        expect(body[0]).toMatchObject({
            ip: '::ffff:127.0.0.1',
            title: 'unknown_device',
            lastActiveDate: expect.any(String),
            deviceId: expect.any(String),
        });
    });

    it('returns 401 status code if there is no userId in payload from refresh token', async () => {
        await request
            .delete(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(generateRefreshTokenCookie({ deviceId: authDeviceSessions[0].deviceId }, '7d'))
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if there is no user with id from refresh token in collection', async () => {
        await request
            .delete(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(
                generateRefreshTokenCookie(
                    { userId: fakeRequestedObjectId, deviceId: authDeviceSessions[0].deviceId },
                    '7d'
                )
            )
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if there is no deviceId in payload from refresh token', async () => {
        await request
            .delete(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(generateRefreshTokenCookie({ userId: users[0]._id.toString() }, '7d'))
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if there is no device with id from refresh token in collection', async () => {
        await request
            .delete(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(generateRefreshTokenCookie({ userId: users[0]._id.toString(), deviceId: fakeRequestedObjectId }, '7d'))
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if refresh token already been used', async () => {
        await delay(1000);

        await request
            .post(`${ROUTES.AUTH}${ROUTES.REFRESH_TOKEN}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        await request
            .delete(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
