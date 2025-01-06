import { authRefreshTokenMiddleware } from '../../features/shared/api/APIMiddlewares';
import { HTTP_STATUS_CODES } from '../../constants';
import { dbHelper } from '../test-helpers';
import { generateToken } from '../test-helpers';
import { authDeviceSessions, fakeRequestedObjectId } from '../dataset';
import { users } from '../dataset';

describe('authRefreshTokenMiddleware', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ authDeviceSessions, users });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['users', 'apiRateLimit', 'authDeviceSessions']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('returns 401 status code if refresh token is not set', async () => {
        const req = {
            cookies: {
                refreshToken: '',
            },
        };
        const res = {
            sendStatus: jest.fn(),
        };

        //@ts-expect-error
        await authRefreshTokenMiddleware(req, res, () => {});

        expect(res.sendStatus).toHaveBeenCalledWith(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if refresh token is expired', async () => {
        const req = {
            cookies: {
                refreshToken: generateToken(
                    { userId: users[0]._id.toString(), deviceId: authDeviceSessions[0].deviceId },
                    0
                ),
            },
        };
        const res = {
            sendStatus: jest.fn(),
        };

        //@ts-expect-error
        await authRefreshTokenMiddleware(req, res, () => {});

        expect(res.sendStatus).toHaveBeenCalledWith(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if there is no userId in payload from refresh token', async () => {
        const req = {
            cookies: {
                refreshToken: generateToken({ deviceId: authDeviceSessions[0].deviceId }, '7d'),
            },
        };
        const res = {
            sendStatus: jest.fn(),
        };

        //@ts-expect-error
        await authRefreshTokenMiddleware(req, res, () => {});

        expect(res.sendStatus).toHaveBeenCalledWith(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if there is no user with id from refresh token in collection', async () => {
        const req = {
            cookies: {
                refreshToken: generateToken(
                    { userId: fakeRequestedObjectId, deviceId: authDeviceSessions[0].deviceId },
                    '7d'
                ),
            },
        };

        const res = {
            sendStatus: jest.fn(),
        };

        //@ts-expect-error
        await authRefreshTokenMiddleware(req, res, () => {});

        expect(res.sendStatus).toHaveBeenCalledWith(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if there is no deviceId in payload from refresh token', async () => {
        const req = {
            cookies: {
                refreshToken: generateToken({ userId: users[0]._id.toString() }, '7d'),
            },
        };

        const res = {
            sendStatus: jest.fn(),
        };

        //@ts-expect-error
        await authRefreshTokenMiddleware(req, res, () => {});

        expect(res.sendStatus).toHaveBeenCalledWith(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if there is no device with id from refresh token in collection', async () => {
        const req = {
            cookies: {
                refreshToken: generateToken({ userId: users[0]._id.toString(), deviceId: fakeRequestedObjectId }, '7d'),
            },
        };

        const res = {
            sendStatus: jest.fn(),
        };

        //@ts-expect-error
        await authRefreshTokenMiddleware(req, res, () => {});

        expect(res.sendStatus).toHaveBeenCalledWith(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
