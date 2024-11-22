import { dbHelper, request } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { posts } from '../dataset';

describe('get all posts', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('gets all available posts', async () => {
        // checking that there are no posts in the database
        await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200, []);

        //populating the database with 8 posts
        dbHelper.setDb({ blogs: [], posts });

        // checking if all posts are in the database
        const { body: allPosts } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);
        expect(allPosts.length).toBe(8);
    });
});
