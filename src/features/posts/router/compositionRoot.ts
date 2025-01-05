import { PostsService } from '../domain';
import { PostsRepository, QueryPostsRepository } from '../repository';
import { BlogsRepository } from '../../blogs/repository';
import { PostsController } from './postsController';
import { CommentsService } from '../../comments/domain';
import { CommentsRepository, QueryCommentsRepository } from '../../comments/repository';
import { UsersRepository } from '../../users/repository';
import { LikesRepository } from '../../likes/repository';

const postsRepository = new PostsRepository();
const queryPostsRepository = new QueryPostsRepository();
const blogsRepository = new BlogsRepository();
const commentsRepository = new CommentsRepository();
const likesRepository = new LikesRepository();
const queryCommentsRepository = new QueryCommentsRepository(likesRepository);
const usersRepository = new UsersRepository();

const postsService = new PostsService(postsRepository, blogsRepository);
const commentsService = new CommentsService(commentsRepository, postsRepository, usersRepository, likesRepository);

export const postsController = new PostsController(
    postsService,
    commentsService,
    queryPostsRepository,
    queryCommentsRepository
);
