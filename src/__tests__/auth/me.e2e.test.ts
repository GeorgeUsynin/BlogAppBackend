import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { AuthMeViewModel } from '../../features/auth/models';
import { users } from '../dataset';

describe('me', () => {
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

    const firstUser = users[0];

    it('returns 200 OK status code if user is authorized', async () => {
        const { body } = await request
            .get(`${ROUTES.AUTH}${ROUTES.ME}`)
            .set(getBearerAuthorization(firstUser._id.toString()))
            .expect(HTTP_STATUS_CODES.OK_200);

        const expectedUser: AuthMeViewModel = {
            email: firstUser.email,
            login: firstUser.login,
            userId: firstUser._id.toString(),
        };

        expect(body).toEqual(expectedUser);
    });

    it('returns 401 Unauthorized status code if account is not authorized', async () => {
        await request.get(`${ROUTES.AUTH}${ROUTES.ME}`).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
