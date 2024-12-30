import { dbHelper, delay, generateRefreshTokenCookie, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { users, authDeviceSessions, fakeRequestedObjectId } from '../dataset';
import { LoginInputModel } from '../../features/auth/models/LoginInputModel';
import { AuthDeviceViewModel } from '../../features/security/models';

describe('delete auth device by id', () => {
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

    it('deletes auth device by id', async () => {
        const { body }: { body: AuthDeviceViewModel[] } = await request
            .get(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        const deviceIdToDelete = body[0].deviceId;

        await request
            .delete(`${ROUTES.SECURITY}${ROUTES.DEVICES}/${deviceIdToDelete}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body: devices }: { body: AuthDeviceViewModel[] } = await request
            .get(`${ROUTES.SECURITY}${ROUTES.DEVICES}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(devices.length).toBe(4);
        devices.forEach(device => {
            expect(device.deviceId).not.toBe(deviceIdToDelete);
        });
    });

    it('returns 401 status code if refresh token already been used', async () => {
        await delay(1000);

        await request
            .post(`${ROUTES.AUTH}${ROUTES.REFRESH_TOKEN}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.OK_200);

        await request
            .delete(`${ROUTES.SECURITY}${ROUTES.DEVICES}/${authDeviceSessions[0].deviceId}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 404 status code if device not found', async () => {
        await request
            .delete(`${ROUTES.SECURITY}${ROUTES.DEVICES}/${fakeRequestedObjectId}`)
            .set(loginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });

    it('returns 403 status code if try to delete the deviceId of other user', async () => {
        const credentialsWithLogin: LoginInputModel = {
            loginOrEmail: 'natasha',
            password: '12345678',
        };

        const natashaLoginResponse = await request
            .post(`${ROUTES.AUTH}${ROUTES.LOGIN}`)
            .send(credentialsWithLogin)
            .expect(HTTP_STATUS_CODES.OK_200);

        const natashaLoginRefreshTokenMatch =
            natashaLoginResponse.headers['set-cookie'][0].match(/refreshToken=([^;]+)/);
        const natashaLoginRefreshToken = natashaLoginRefreshTokenMatch?.[1] as string;

        const natashaLoginRefreshTokenCookie = {
            Cookie: [`refreshToken=${natashaLoginRefreshToken}; Path=/; HttpOnly; Secure`],
        };

        await request
            .delete(`${ROUTES.SECURITY}${ROUTES.DEVICES}/${authDeviceSessions[0].deviceId}`)
            .set(natashaLoginRefreshTokenCookie)
            .expect(HTTP_STATUS_CODES.FORBIDDEN_403);
    });
});
