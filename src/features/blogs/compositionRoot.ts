import 'reflect-metadata';
import { Container } from 'inversify';
import { BlogsRepository, QueryBlogsRepository } from './infrastructure';
import { BlogsService } from './application';
import { PostsService } from '../posts/application';
import { PostsRepository, QueryPostsRepository } from '../posts/infrastructure';
import { BlogsController } from './api/blogsController';

export const container: Container = new Container();

container.bind(BlogsRepository).toSelf();
container.bind(QueryBlogsRepository).toSelf();
container.bind(PostsRepository).toSelf();
container.bind(QueryPostsRepository).toSelf();
container.bind(BlogsService).toSelf();
container.bind(PostsService).toSelf();
container.bind(BlogsController).toSelf();
