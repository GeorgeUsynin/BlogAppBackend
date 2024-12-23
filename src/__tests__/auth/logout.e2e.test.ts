import { dbHelper, request, generateRefreshTokenCookie } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { fakeRequestedObjectId, users, authDeviceSessions } from '../dataset';
import { LoginInputModel } from '../../features/auth/models';

describe('logout', () => {
    let loginRefreshTokenCookie: { Cookie: string[] };

    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ users, authDeviceSessions });

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
        await dbHelper.resetCollections(['users', 'authDeviceSessions', 'apiRateLimit']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('returns 204 status code if logout is successful', async () => {
        await request
            .post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);
    });

    it('returns 401 status code if refresh token is not set', async () => {
        await request.post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if refresh token is expired', async () => {
        await request
            .post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`)
            .set(
                generateRefreshTokenCookie(
                    { userId: users[0]._id.toString(), deviceId: authDeviceSessions[0].deviceId },
                    0
                )
            )
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if there is no userId in payload from refresh token', async () => {
        await request
            .post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`)
            .set(generateRefreshTokenCookie({ deviceId: authDeviceSessions[0].deviceId }, '7d'))
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if there is no user with id from refresh token in collection', async () => {
        await request
            .post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`)
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
            .post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`)
            .set(generateRefreshTokenCookie({ userId: users[0]._id.toString() }, '7d'))
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if there is no device with id from refresh token in collection', async () => {
        await request
            .post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`)
            .set(generateRefreshTokenCookie({ userId: users[0]._id.toString(), deviceId: fakeRequestedObjectId }, '7d'))
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if refresh token already been used', async () => {
        await new Promise((res, rej) => {
            setTimeout(() => {
                res({});
            }, 1000);
        });

        await request
            .post(`${ROUTES.AUTH}${ROUTES.REFRESH_TOKEN}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        await request
            .post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
