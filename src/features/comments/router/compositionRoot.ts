import { CommentsService } from '../domain';
import { CommentsRepository, QueryCommentsRepository } from '../repository';
import { PostsRepository } from '../../posts/repository';
import { CommentsController } from './commentsController';
import { UsersRepository } from '../../users/repository';

const commentsRepository = new CommentsRepository();
const queryCommentsRepository = new QueryCommentsRepository();
const postsRepository = new PostsRepository();
const usersRepository = new UsersRepository();

const commentsService = new CommentsService(commentsRepository, postsRepository, usersRepository);

export const commentsController = new CommentsController(commentsService, queryCommentsRepository);
