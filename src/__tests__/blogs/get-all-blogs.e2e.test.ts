import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { blogs } from '../dataset';

describe('get all blogs', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('gets all available blogs', async () => {
        // checking that there are no blogs in the database
        await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200, []);

        //populating the database with 4 blogs
        await dbHelper.setDb({ blogs, posts: [] });

        // checking if all blogs are in the database
        const { body: allBlogs } = await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200);
        expect(allBlogs.length).toBe(4);
    });
});
