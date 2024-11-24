import { dbHelper, request, createErrorMessages, getAuthorization } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { fakeRequestedObjectId, blogs, longContent, longTitle, longShortDescription } from '../dataset';
import { CreateUpdatePostInputModel, PostViewModel } from '../../features/posts/models';

describe('create a post by requested blogId', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs, posts: [] });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['blogs', 'posts']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    const secondBlogId = blogs[1]._id.toString();

    it('creates a new post by requested blogId', async () => {
        const blogName = (await dbHelper.getBlog(1)).name;

        const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
            title: 'New title',
            content: 'New content',
            shortDescription: 'New short description',
        };

        const createdPost: PostViewModel = {
            id: expect.any(String),
            createdAt: expect.any(String),
            blogId: secondBlogId,
            blogName,
            content: newPost.content,
            shortDescription: newPost.shortDescription,
            title: newPost.title,
        };

        //creating new post
        const { body: newPostBodyResponse } = await request
            .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
            .set(getAuthorization())
            .send(newPost)
            .expect(HTTP_STATUS_CODES.CREATED_201);

        expect(newPostBodyResponse).toEqual(createdPost);

        //checking that the post was created
        const { body: allPostsBodyResponse } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);

        expect(allPostsBodyResponse).toEqual([createdPost]);
    });

    describe('post payload validation', () => {
        describe('title', () => {
            it('returns 400 status code and proper error object if `title` is missing', async () => {
                //@ts-expect-error bad request (title is missing)
                const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `title` is empty or contain only spaces', async () => {
                const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
                    title: ' ',
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `title` type', async () => {
                const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
                    //@ts-expect-error bad request (title type is invalid)
                    title: [],
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `title` max length', async () => {
                const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
                    title: longTitle,
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['maxLength'] })).toEqual(body);
            });
        });

        describe('shortDescription', () => {
            it('returns 400 status code and proper error object if `shortDescription` is missing', async () => {
                //@ts-expect-error bad request (shortDescription is missing)
                const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
                    title: 'New title',
                    content: 'New content',
                };
                const { body } = await request
                    .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `shortDescription` is empty or contain only spaces', async () => {
                const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
                    title: 'New title',
                    content: 'New content',
                    shortDescription: ' ',
                };
                const { body } = await request
                    .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `shortDescription` type', async () => {
                const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
                    title: 'New title',
                    //@ts-expect-error bad request (shortDescription type is invalid)
                    shortDescription: [],
                    content: 'New content',
                };
                const { body } = await request
                    .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `shortDescription` max length', async () => {
                const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
                    title: 'New title',
                    shortDescription: longShortDescription,
                    content: 'New content',
                };
                const { body } = await request
                    .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['maxLength'] })).toEqual(body);
            });
        });

        describe('content', () => {
            it('returns 400 status code and proper error object if `content` is missing', async () => {
                //@ts-expect-error bad request (content is missing)
                const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
                    title: 'New title',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `content` is empty or contain only spaces', async () => {
                const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
                    title: 'New title',
                    content: ' ',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` type', async () => {
                const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
                    title: 'New title',
                    shortDescription: 'New short description',
                    //@ts-expect-error bad request (content type is invalid)
                    content: [],
                };
                const { body } = await request
                    .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` max length', async () => {
                const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
                    title: 'New title',
                    shortDescription: 'New short description',
                    content: longContent,
                };
                const { body } = await request
                    .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['maxLength'] })).toEqual(body);
            });
        });
    });

    it('return 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
            title: 'New title',
            content: 'New content',
            shortDescription: 'New short description',
        };

        await request
            .post(`${ROUTES.BLOGS}/${secondBlogId}/${ROUTES.POSTS}`)
            .send(newPost)
            .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });

    it('returns 404 status code if there is no requested blogId in database', async () => {
        const newPost: Omit<CreateUpdatePostInputModel, 'blogId'> = {
            title: 'New title',
            content: 'New content',
            shortDescription: 'New short description',
        };

        await request
            .post(`${ROUTES.BLOGS}/${fakeRequestedObjectId}/${ROUTES.POSTS}`)
            .set(getAuthorization())
            .send(newPost)
            .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
    });
});
