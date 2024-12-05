import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { comments, fakeRequestedObjectId } from '../dataset';

describe('get comment by id', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ comments });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['comments']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('returns comment by requested id', async () => {
        const { body: allComments } = await request.get(ROUTES.COMMENTS).expect(HTTP_STATUS_CODES.OK_200);

        const secondCommentId = allComments.items[1].id;

        //requesting comment by id
        const { body } = await request.get(`${ROUTES.COMMENTS}/${secondCommentId}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual(allComments.items[1]);
    });

    it('returns 404 status code if there is no requested comment in database', async () => {
        //requesting comment by id
        await request.get(`${ROUTES.BLOGS}/${fakeRequestedObjectId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
