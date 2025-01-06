import { dbHelper, request, createErrorMessages, getAuthorization } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { fakeRequestedObjectId, blogs, longContent, longTitle, longShortDescription } from '../dataset';
import { PostItemViewModel } from '../../features/posts/api';
import { CreateUpdatePostInputDTO } from '../../features/posts/application';

describe('create a post', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    beforeEach(async () => {
        await dbHelper.setDb({ blogs });
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['blogs', 'posts']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('creates a new post', async () => {
        const blogId = (await dbHelper.getBlog(1))._id.toString();
        const blogName = (await dbHelper.getBlog(1)).name;

        const newPost: CreateUpdatePostInputDTO = {
            title: 'New title',
            blogId,
            content: 'New content',
            shortDescription: 'New short description',
        };

        const createdPost: PostItemViewModel = {
            id: expect.any(String),
            createdAt: expect.any(String),
            blogId,
            blogName,
            content: newPost.content,
            shortDescription: newPost.shortDescription,
            title: newPost.title,
        };

        //creating new post
        const { body: newPostBodyResponse } = await request
            .post(ROUTES.POSTS)
            .set(getAuthorization())
            .send(newPost)
            .expect(HTTP_STATUS_CODES.CREATED_201);

        expect(newPostBodyResponse).toEqual(createdPost);

        //checking that the post was created
        const { body: allPostsBodyResponse } = await request.get(ROUTES.POSTS).expect(HTTP_STATUS_CODES.OK_200);

        expect(allPostsBodyResponse.items).toEqual([createdPost]);
    });

    describe('post payload validation', () => {
        describe('title', () => {
            it('returns 400 status code and proper error object if `title` is missing', async () => {
                //@ts-expect-error bad request (title is missing)
                const newPost: CreateUpdatePostInputDTO = {
                    blogId: (await dbHelper.getBlog(1))._id.toString(),
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `title` is empty or contain only spaces', async () => {
                const newPost: CreateUpdatePostInputDTO = {
                    title: ' ',
                    blogId: (await dbHelper.getBlog(1))._id.toString(),
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `title` type', async () => {
                const newPost: CreateUpdatePostInputDTO = {
                    //@ts-expect-error bad request (title type is invalid)
                    title: [],
                    blogId: (await dbHelper.getBlog(1))._id.toString(),
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `title` max length', async () => {
                const newPost: CreateUpdatePostInputDTO = {
                    title: longTitle,
                    blogId: (await dbHelper.getBlog(1))._id.toString(),
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ title: ['maxLength'] })).toEqual(body);
            });
        });

        describe('shortDescription', () => {
            it('returns 400 status code and proper error object if `shortDescription` is missing', async () => {
                //@ts-expect-error bad request (shortDescription is missing)
                const newPost: CreateUpdatePostInputDTO = {
                    title: 'New title',
                    blogId: (await dbHelper.getBlog(1))._id.toString(),
                    content: 'New content',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `shortDescription` is empty or contain only spaces', async () => {
                const newPost: CreateUpdatePostInputDTO = {
                    title: 'New title',
                    blogId: (await dbHelper.getBlog(1))._id.toString(),
                    content: 'New content',
                    shortDescription: ' ',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `shortDescription` type', async () => {
                const newPost: CreateUpdatePostInputDTO = {
                    title: 'New title',
                    //@ts-expect-error bad request (shortDescription type is invalid)
                    shortDescription: [],
                    blogId: (await dbHelper.getBlog(1))._id.toString(),
                    content: 'New content',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `shortDescription` max length', async () => {
                const newPost: CreateUpdatePostInputDTO = {
                    title: 'New title',
                    shortDescription: longShortDescription,
                    blogId: (await dbHelper.getBlog(1))._id.toString(),
                    content: 'New content',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ shortDescription: ['maxLength'] })).toEqual(body);
            });
        });

        describe('content', () => {
            it('returns 400 status code and proper error object if `content` is missing', async () => {
                //@ts-expect-error bad request (content is missing)
                const newPost: CreateUpdatePostInputDTO = {
                    title: 'New title',
                    blogId: (await dbHelper.getBlog(1))._id.toString(),
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `content` is empty or contain only spaces', async () => {
                const newPost: CreateUpdatePostInputDTO = {
                    title: 'New title',
                    blogId: (await dbHelper.getBlog(1))._id.toString(),
                    content: ' ',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` type', async () => {
                const newPost: CreateUpdatePostInputDTO = {
                    title: 'New title',
                    blogId: (await dbHelper.getBlog(1))._id.toString(),
                    shortDescription: 'New short description',
                    //@ts-expect-error bad request (content type is invalid)
                    content: [],
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `content` max length', async () => {
                const newPost: CreateUpdatePostInputDTO = {
                    title: 'New title',
                    blogId: (await dbHelper.getBlog(1))._id.toString(),
                    shortDescription: 'New short description',
                    content: longContent,
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ content: ['maxLength'], from: 'posts' })).toEqual(body);
            });
        });

        describe('blogId', () => {
            it('returns 400 status code and proper error object if `blogId` is missing', async () => {
                //@ts-expect-error bad request (blogId is missing)
                const newPost: CreateUpdatePostInputDTO = {
                    title: 'New title',
                    shortDescription: 'New short description',
                    content: 'New content',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ blogId: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `blogId` is empty or contain only spaces', async () => {
                const newPost: CreateUpdatePostInputDTO = {
                    title: 'New title',
                    blogId: ' ',
                    content: 'New content',
                    shortDescription: 'New short description',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ blogId: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `blogId` type', async () => {
                const newPost: CreateUpdatePostInputDTO = {
                    title: 'New title',
                    //@ts-expect-error bad request (blogId type is invalid)
                    blogId: [],
                    shortDescription: 'New short description',
                    content: 'New content',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ blogId: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `blogId` does not exist', async () => {
                const newPost: CreateUpdatePostInputDTO = {
                    title: 'New title',
                    blogId: fakeRequestedObjectId,
                    shortDescription: 'New short description',
                    content: 'New content',
                };
                const { body } = await request
                    .post(ROUTES.POSTS)
                    .set(getAuthorization())
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ blogId: ['blogIdNotExist'] })).toEqual(body);
            });
        });
    });

    it('returns 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const newPost: CreateUpdatePostInputDTO = {
            title: 'New title',
            blogId: (await dbHelper.getBlog(1))._id.toString(),
            content: 'New content',
            shortDescription: 'New short description',
        };

        await request.post(ROUTES.POSTS).send(newPost).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
