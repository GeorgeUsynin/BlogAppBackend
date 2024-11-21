import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { blogs, fakeRequestedObjectId } from '../dataset';

describe('get blog by id', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs, posts: [] });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['blogs']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('returns blog by requested id', async () => {
        const { body: allBlogs } = await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200);
        const secondBlogId = allBlogs[1].id;

        //requesting blog by id
        const { body } = await request.get(`${ROUTES.BLOGS}/${secondBlogId}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual(allBlogs[1]);
    });

    it('returns 404 status code if there is no requested blog in database', async () => {
        //requesting blog by id
        await request.get(`${ROUTES.BLOGS}/${fakeRequestedObjectId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
