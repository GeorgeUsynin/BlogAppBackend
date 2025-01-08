import 'reflect-metadata';
import { Container } from 'inversify';
import { AuthService, RegistrationService, PasswordService } from '../application';
import { AuthDeviceSessionsRepository } from '../../security/infrastructure';
import { AuthDeviceSessionsService } from '../../security/application';
import { JWTService } from '../../shared/application/services';
import { UsersRepository, QueryUsersRepository } from '../../users/infrastructure';
import { EmailManager } from '../../shared/application/managers/emailManager';
import { EmailAdapter } from '../../shared/infrastructure';
import { AuthController } from './authController';

export const container: Container = new Container();

container.bind(JWTService).toSelf();
container.bind(AuthDeviceSessionsRepository).toSelf();
container.bind(AuthDeviceSessionsService).toSelf();
container.bind(UsersRepository).toSelf();
container.bind(QueryUsersRepository).toSelf();
container.bind(AuthService).toSelf();
container.bind(EmailAdapter).toSelf();
container.bind(EmailManager).toSelf();
container.bind(RegistrationService).toSelf();
container.bind(PasswordService).toSelf();
container.bind(AuthController).toSelf();
