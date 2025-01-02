import { PostsService } from '../domain';
import { PostsRepository, QueryPostsRepository } from '../repository';
import { BlogsRepository } from '../../blogs/repository';
import { PostsController } from './postsController';
import { CommentsService } from '../../comments/domain';
import { CommentsRepository, QueryCommentsRepository } from '../../comments/repository';

const postsRepository = new PostsRepository();
const queryPostsRepository = new QueryPostsRepository();
const blogsRepository = new BlogsRepository();
const commentsRepository = new CommentsRepository();
const queryCommentsRepository = new QueryCommentsRepository();

const postsService = new PostsService(postsRepository, blogsRepository);
const commentsService = new CommentsService(commentsRepository, postsRepository);

export const postsController = new PostsController(
    postsService,
    commentsService,
    queryPostsRepository,
    queryCommentsRepository
);
