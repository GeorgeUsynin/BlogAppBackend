import { dbHelper, request, delay } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { users, authDeviceSessions } from '../dataset';
import { LoginInputDTO } from '../../features/auth/application';

describe('refresh token', () => {
    let loginRefreshTokenCookie: { Cookie: string[] };

    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ authDeviceSessions, users });

        // create login refresh token using login credentials
        const credentialsWithLogin: LoginInputDTO = {
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

    it('returns access token and refresh token if refresh token is valid', async () => {
        const response = await request
            .post(`${ROUTES.AUTH}${ROUTES.REFRESH_TOKEN}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(response.body.accessToken).toEqual(expect.any(String));
        expect(response.headers['set-cookie']).toBeDefined();
        expect(response.headers['set-cookie'][0]).toContain('refreshToken');
        expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
        expect(response.headers['set-cookie'][0]).toContain('Secure');
    });

    it('returns 401 status code if refresh token already been used', async () => {
        await delay(1000);

        await request
            .post(`${ROUTES.AUTH}${ROUTES.REFRESH_TOKEN}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        await request
            .post(`${ROUTES.AUTH}${ROUTES.REFRESH_TOKEN}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
