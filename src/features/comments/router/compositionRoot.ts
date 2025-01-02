import { CommentsService } from '../domain';
import { CommentsRepository, QueryCommentsRepository } from '../repository';
import { PostsRepository } from '../../posts/repository';
import { CommentsController } from './commentsController';

const commentsRepository = new CommentsRepository();
const queryCommentsRepository = new QueryCommentsRepository();
const postsRepository = new PostsRepository();

const commentsService = new CommentsService(commentsRepository, postsRepository);

export const commentsController = new CommentsController(commentsService, queryCommentsRepository);
