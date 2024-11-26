import { request } from './test-helpers';
import { dbHelper } from './test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../constants';
import { blogs, posts } from './dataset';

describe('/testing/all-data', () => {
    beforeEach(async () => {
        await dbHelper.connectToDb();
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('deletes all data from database', async () => {
        //populating the database with blogs
        await dbHelper.setDb({ blogs, posts });

        // checking if all blogs are in the database
        const { body: allBlogs } = await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200);
        expect(allBlogs.totalCount).toBe(4);
        // checking if all posts are in the database
        const { body: allPosts } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);
        expect(allPosts.totalCount).toBe(8);

        // deleting all data
        await request.delete(ROUTES.TESTING).expect(HTTP_STATUS_CODES.NO_CONTENT_204);
    });
});
