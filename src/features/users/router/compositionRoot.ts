import { QueryUsersRepository, UsersRepository } from '../repository';
import { UsersService } from '../domain';
import { UsersController } from './usersController';

const queryUsersRepository = new QueryUsersRepository();
const usersRepository = new UsersRepository();

export const usersService = new UsersService(usersRepository);

export const usersController = new UsersController(usersService, queryUsersRepository);
