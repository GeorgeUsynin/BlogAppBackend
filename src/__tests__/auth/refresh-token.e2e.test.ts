import { dbHelper, request, generateRefreshTokenCookie } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { users, fakeRequestedObjectId } from '../dataset';

describe('refresh token', () => {
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

    it('returns access token and refresh token if refresh token is valid', async () => {
        const response = await request
            .post(`${ROUTES.AUTH}${ROUTES.REFRESH_TOKEN}`)
            .set(generateRefreshTokenCookie(users[0]._id.toString(), '7d'))
            .expect(HTTP_STATUS_CODES.OK_200);

        expect(response.body.accessToken).toEqual(expect.any(String));
        expect(response.headers['set-cookie']).toBeDefined();
        expect(response.headers['set-cookie'][0]).toContain('refreshToken');
        expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
        expect(response.headers['set-cookie'][0]).toContain('Secure');
    });

    it('returns 401 status code if refresh token is not set', async () => {
        await request.post(`${ROUTES.AUTH}${ROUTES.REFRESH_TOKEN}`).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if refresh token is expired', async () => {
        await request
            .post(`${ROUTES.AUTH}${ROUTES.REFRESH_TOKEN}`)
            .set(generateRefreshTokenCookie(users[0]._id.toString(), 0))
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if there is no user with id from refresh token', async () => {
        await request
            .post(`${ROUTES.AUTH}${ROUTES.REFRESH_TOKEN}`)
            .set(generateRefreshTokenCookie(fakeRequestedObjectId, '7d'))
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if refresh token already been used', async () => {
        await request
            .post(`${ROUTES.AUTH}${ROUTES.REFRESH_TOKEN}`)
            .set(generateRefreshTokenCookie(users[0]._id.toString(), '7d'))
            .expect(HTTP_STATUS_CODES.OK_200);

        const { body } = await request
            .post(`${ROUTES.AUTH}${ROUTES.REFRESH_TOKEN}`)
            .set(generateRefreshTokenCookie(users[0]._id.toString(), '7d'))
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

        expect(body.errorsMessages).toEqual([{ field: '', message: 'Token already been used' }]);
    });
});
