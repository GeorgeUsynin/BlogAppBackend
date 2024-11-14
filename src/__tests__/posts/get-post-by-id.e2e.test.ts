import { request } from '../test-helpers';
import { setDB } from '../../database';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { dataset } from '../dataset';

describe('get post by id', () => {
    it('returns post by requested id', async () => {
        //populating database
        setDB({ blogs: [], posts: dataset.posts });

        const requestedId = '103';
        //requesting post by id
        const { body } = await request.get(`${ROUTES.POSTS}/${requestedId}`).expect(HTTP_STATUS_CODES.OK_200);

        expect(body).toEqual(dataset.posts[2]);
    });

    it('returns 404 status code if there is no requested post in database', async () => {
        //populating database
        setDB({ blogs: [], posts: dataset.posts });

        const fakeRequestedId = '10001';
        //requesting post by id
        await request.get(`${ROUTES.POSTS}/${fakeRequestedId}`).expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
