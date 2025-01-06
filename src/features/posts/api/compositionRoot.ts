import 'reflect-metadata';
import { Container } from 'inversify';
import { PostsService } from '../domain';
import { PostsRepository, QueryPostsRepository } from '../infrastructure';
import { BlogsRepository } from '../../blogs/infrastructure';
import { PostsController } from './postsController';
import { CommentsService } from '../../comments/domain';
import { CommentsRepository, QueryCommentsRepository } from '../../comments/repository';
import { UsersRepository } from '../../users/repository';
import { LikesRepository } from '../../likes/repository';

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
