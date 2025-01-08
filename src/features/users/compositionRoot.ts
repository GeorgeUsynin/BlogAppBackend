import 'reflect-metadata';
import { Container } from 'inversify';
import { QueryUsersRepository, UsersRepository } from './infrastructure';
import { UsersService } from './application';
import { UsersController } from './api/usersController';

export const container: Container = new Container();

container.bind(QueryUsersRepository).toSelf();
container.bind(UsersRepository).toSelf();
container.bind(UsersService).toSelf();
container.bind(UsersController).toSelf();
