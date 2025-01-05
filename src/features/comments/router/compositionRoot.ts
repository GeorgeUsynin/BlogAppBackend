import { CommentsService } from '../domain';
import { CommentsRepository, QueryCommentsRepository } from '../repository';
import { PostsRepository } from '../../posts/repository';
import { CommentsController } from './commentsController';
import { UsersRepository } from '../../users/repository';
import { LikesRepository } from '../../likes/repository';

const commentsRepository = new CommentsRepository();
const likesRepository = new LikesRepository();
const queryCommentsRepository = new QueryCommentsRepository(likesRepository);
const postsRepository = new PostsRepository();
const usersRepository = new UsersRepository();

const commentsService = new CommentsService(commentsRepository, postsRepository, usersRepository, likesRepository);

export const commentsController = new CommentsController(commentsService, queryCommentsRepository);
