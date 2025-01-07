import 'reflect-metadata';
import { Container } from 'inversify';
import { CommentsService } from '../domain';
import { CommentsRepository, QueryCommentsRepository } from '../infrastructure';
import { PostsRepository } from '../../posts/infrastructure';
import { CommentsController } from './commentsController';
import { UsersRepository } from '../../users/repository';
import { LikesRepository } from '../../likes/repository';

export const container: Container = new Container();

container.bind(CommentsRepository).toSelf();
container.bind(LikesRepository).toSelf();
container.bind(QueryCommentsRepository).toSelf();
container.bind(PostsRepository).toSelf();
container.bind(UsersRepository).toSelf();
container.bind(CommentsService).toSelf();
container.bind(CommentsController).toSelf();
