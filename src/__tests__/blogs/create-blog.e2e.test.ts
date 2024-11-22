import { request, createErrorMessages, getAuthorization, dbHelper } from '../test-helpers';
import { HTTP_STATUS_CODES, ROUTES } from '../../constants';
import { longDescription, longWebsiteUrl } from '../dataset';
import { CreateUpdateBlogInputModel, BlogViewModel } from '../../features/blogs/models';

describe('create a blog', () => {
    beforeAll(async () => {
        await dbHelper.connectToDb();
    });

    afterEach(async () => {
        await dbHelper.resetCollections(['blogs']);
    });

    afterAll(async () => {
        await dbHelper.dropDb();
        await dbHelper.closeConnection();
    });

    it('creates a new blog', async () => {
        const newBlog: CreateUpdateBlogInputModel = {
            description: 'Eco lifestyle description',
            name: 'Eco Lifestyle',
            websiteUrl: 'https://ecolifestyle.com',
        };

        const createdBlog: BlogViewModel = {
            id: expect.any(String),
            createdAt: expect.any(String),
            isMembership: false,
            ...newBlog,
        };

        //creating new blog
        const { body: newBlogBodyResponse } = await request
            .post(ROUTES.BLOGS)
            .set(getAuthorization())
            .send(newBlog)
            .expect(HTTP_STATUS_CODES.CREATED_201);

        expect(newBlogBodyResponse).toEqual(createdBlog);

        //checking that the blog was created
        const { body: allBlogsBodyResponse } = await request.get(ROUTES.BLOGS).expect(HTTP_STATUS_CODES.OK_200);

        expect(allBlogsBodyResponse).toEqual([createdBlog]);
    });

    describe('blog payload validation', () => {
        describe('name', () => {
            it('returns 400 status code and proper error object if `name` is missing', async () => {
                //@ts-expect-error bad request (name is missing)
                const newBlog: CreateUpdateBlogInputModel = {
                    description: 'Eco lifestyle description',
                    websiteUrl: 'https://ecolifestyle.com',
                };
                const { body } = await request
                    .post(ROUTES.BLOGS)
                    .set(getAuthorization())
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ name: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `name` is empty or contain only spaces', async () => {
                const newBlog: CreateUpdateBlogInputModel = {
                    name: ' ',
                    description: 'Eco lifestyle description',
                    websiteUrl: 'https://ecolifestyle.com',
                };
                const { body } = await request
                    .post(ROUTES.BLOGS)
                    .set(getAuthorization())
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ name: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `name` type', async () => {
                const newBlog: CreateUpdateBlogInputModel = {
                    //@ts-expect-error bad request (name type is invalid)
                    name: [],
                    description: 'Eco lifestyle description',
                    websiteUrl: 'https://ecolifestyle.com',
                };
                const { body } = await request
                    .post(ROUTES.BLOGS)
                    .set(getAuthorization())
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ name: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `name` max length', async () => {
                const newBlog: CreateUpdateBlogInputModel = {
                    name: 'More than fifteen characters',
                    description: 'Eco lifestyle description',
                    websiteUrl: 'https://ecolifestyle.com',
                };
                const { body } = await request
                    .post(ROUTES.BLOGS)
                    .set(getAuthorization())
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ name: ['maxLength'] })).toEqual(body);
            });
        });

        describe('description', () => {
            it('returns 400 status code and proper error object if `description` is missing', async () => {
                //@ts-expect-error bad request (description is missing)
                const newBlog: CreateUpdateBlogInputModel = {
                    name: 'Eco Lifestyle',
                    websiteUrl: 'https://ecolifestyle.com',
                };
                const { body } = await request
                    .post(ROUTES.BLOGS)
                    .set(getAuthorization())
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ description: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `description` is empty or contain only spaces', async () => {
                const newBlog: CreateUpdateBlogInputModel = {
                    name: 'Eco Lifestyle',
                    description: ' ',
                    websiteUrl: 'https://ecolifestyle.com',
                };
                const { body } = await request
                    .post(ROUTES.BLOGS)
                    .set(getAuthorization())
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ description: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `description` type', async () => {
                const newBlog: CreateUpdateBlogInputModel = {
                    name: 'Eco Lifestyle',
                    //@ts-expect-error bad request (description type is invalid)
                    description: [],
                    websiteUrl: 'https://ecolifestyle.com',
                };
                const { body } = await request
                    .post(ROUTES.BLOGS)
                    .set(getAuthorization())
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ description: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `description` max length', async () => {
                const newBlog: CreateUpdateBlogInputModel = {
                    name: 'Eco Lifestyle',
                    description: longDescription,
                    websiteUrl: 'https://ecolifestyle.com',
                };
                const { body } = await request
                    .post(ROUTES.BLOGS)
                    .set(getAuthorization())
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ description: ['maxLength'] })).toEqual(body);
            });
        });

        describe('websiteUrl', () => {
            it('returns 400 status code and proper error object if `websiteUrl` is missing', async () => {
                //@ts-expect-error bad request (websiteUrl is missing)
                const newBlog: CreateUpdateBlogInputModel = {
                    name: 'Eco Lifestyle',
                    description: 'Eco lifestyle description',
                };
                const { body } = await request
                    .post(ROUTES.BLOGS)
                    .set(getAuthorization())
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['isRequired'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object if `websiteUrl` is empty or contain only spaces', async () => {
                const newBlog: CreateUpdateBlogInputModel = {
                    name: 'Eco Lifestyle',
                    description: 'Eco lifestyle description',
                    websiteUrl: ' ',
                };
                const { body } = await request
                    .post(ROUTES.BLOGS)
                    .set(getAuthorization())
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['isEmptyString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `websiteUrl` type', async () => {
                const newBlog: CreateUpdateBlogInputModel = {
                    name: 'Eco Lifestyle',
                    description: 'Eco lifestyle description',
                    //@ts-expect-error bad request (websiteUrl type is invalid)
                    websiteUrl: [],
                };
                const { body } = await request
                    .post(ROUTES.BLOGS)
                    .set(getAuthorization())
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['isString'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for bad `websiteUrl` max length', async () => {
                const newBlog: CreateUpdateBlogInputModel = {
                    name: 'Eco Lifestyle',
                    description: 'Eco lifestyle description',
                    websiteUrl: longWebsiteUrl,
                };
                const { body } = await request
                    .post(ROUTES.BLOGS)
                    .set(getAuthorization())
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['maxLength'] })).toEqual(body);
            });

            it('returns 400 status code and proper error object for invalid `websiteUrl` format', async () => {
                const newBlog: CreateUpdateBlogInputModel = {
                    name: 'Eco Lifestyle',
                    description: 'Eco lifestyle description',
                    websiteUrl: 'invalid-url',
                };
                const { body } = await request
                    .post(ROUTES.BLOGS)
                    .set(getAuthorization())
                    .send(newBlog)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

                expect(createErrorMessages({ websiteUrl: ['isPattern'] })).toEqual(body);
            });
        });
    });

    it('return 401 Unauthorized status code if there is no proper Authorization header', async () => {
        const newBlog: CreateUpdateBlogInputModel = {
            description: 'Eco lifestyle description',
            name: 'Eco Lifestyle',
            websiteUrl: 'https://ecolifestyle.com',
        };

        await request.post(ROUTES.BLOGS).send(newBlog).expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    });
});
