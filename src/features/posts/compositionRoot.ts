import 'reflect-metadata';
import { Container } from 'inversify';
import { PostsService } from './application';
import { PostsRepository, QueryPostsRepository } from './infrastructure';
import { BlogsRepository } from '../blogs/infrastructure';
import { PostsController } from './api/postsController';
import { CommentsService } from '../comments/application';
import { CommentsRepository, QueryCommentsRepository } from '../comments/infrastructure';
import { UsersRepository } from '../users/infrastructure';
import { LikesRepository } from '../likes/infrastructure';

export const container: Container = new Container();

container.bind(PostsRepository).toSelf();
container.bind(QueryPostsRepository).toSelf();
container.bind(BlogsRepository).toSelf();
container.bind(CommentsRepository).toSelf();
container.bind(QueryCommentsRepository).toSelf();
container.bind(LikesRepository).toSelf();
container.bind(UsersRepository).toSelf();
container.bind(PostsService).toSelf();
container.bind(CommentsService).toSelf();
container.bind(PostsController).toSelf();
