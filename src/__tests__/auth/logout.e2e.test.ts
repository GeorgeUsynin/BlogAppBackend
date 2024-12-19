import { dbHelper, request, generateRefreshTokenCookie } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { fakeRequestedObjectId, users } from '../dataset';

describe('logout', () => {
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

    it('returns 204 status code if logout is successful', async () => {
        await request
            .post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`)
            .set(generateRefreshTokenCookie(users[0]._id.toString(), '7d'))
            .expect(HTTP_STATUS_CODES.NO_CONTENT_204);
    });

    it('returns 401 status code if refresh token is not set', async () => {
        await request.post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if refresh token is expired', async () => {
        await request
            .post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`)
            .set(generateRefreshTokenCookie(users[0]._id.toString(), 0))
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if there is no user with id from refresh token', async () => {
        await request
            .post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`)
            .set(generateRefreshTokenCookie(fakeRequestedObjectId, '7d'))
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 401 status code if refresh token already been used', async () => {
        const cookie = generateRefreshTokenCookie(users[0]._id.toString(), '7d');

        await request.post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`).set(cookie).expect(HTTP_STATUS_CODES.NO_CONTENT_204);

        const { body } = await request
            .post(`${ROUTES.AUTH}${ROUTES.LOGOUT}`)
            .set(cookie)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

        expect(body.errorsMessages).toEqual([{ field: '', message: 'Token already been used' }]);
    });
});
