import 'reflect-metadata';
import { Container } from 'inversify';
import { CommentsService } from '../application';
import { LikesService } from '../../likes/application';
import { CommentsRepository, QueryCommentsRepository } from '../infrastructure';
import { PostsRepository } from '../../posts/infrastructure';
import { UsersRepository } from '../../users/infrastructure';
import { LikesRepository } from '../../likes/infrastructure';
import { CommentsController } from './commentsController';

export const container: Container = new Container();

container.bind(CommentsRepository).toSelf();
container.bind(LikesRepository).toSelf();
container.bind(LikesService).toSelf();
container.bind(QueryCommentsRepository).toSelf();
container.bind(PostsRepository).toSelf();
container.bind(UsersRepository).toSelf();
container.bind(CommentsService).toSelf();
container.bind(CommentsController).toSelf();
