import { BlogsRepository, QueryBlogsRepository } from '../repository';
import { BlogsService } from '../domain';
import { PostsService } from '../../posts/domain';
import { PostsRepository, QueryPostsRepository } from '../../posts/repository';
import { BlogsController } from './blogsController';

const blogsRepository = new BlogsRepository();
const queryBlogsRepository = new QueryBlogsRepository();

const postsRepository = new PostsRepository();
const queryPostsRepository = new QueryPostsRepository();

const blogsService = new BlogsService(blogsRepository);
const postService = new PostsService(postsRepository, blogsRepository);

export const blogsController = new BlogsController(
    blogsService,
    queryBlogsRepository,
    postService,
    queryPostsRepository
);
