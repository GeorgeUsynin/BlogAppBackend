import { AuthService, RegistrationService, PasswordService } from '../domain';
import { AuthDeviceSessionsRepository } from '../../security/repository';
import { AuthDeviceSessionsService } from '../../security/domain';
import { JWTService } from '../../shared/application/services';
import { UsersRepository, QueryUsersRepository } from '../../users/repository';
import { EmailManager } from '../../shared/application/managers/emailManager';
import { EmailAdapter } from '../../shared/infrastructure/adapters';
import { AuthController } from './authController';

const jwtService = new JWTService();
const authDeviceSessionsRepository = new AuthDeviceSessionsRepository();
const authDeviceSessionsService = new AuthDeviceSessionsService(authDeviceSessionsRepository);
const usersRepository = new UsersRepository();
const queryUsersRepository = new QueryUsersRepository();

export const authService = new AuthService(jwtService, authDeviceSessionsService, usersRepository);
const emailAdapter = new EmailAdapter();
const emailManager = new EmailManager(emailAdapter);
const registrationService = new RegistrationService(usersRepository, emailManager);

const passwordService = new PasswordService(usersRepository, emailManager);

export const authController = new AuthController(
    authService,
    registrationService,
    passwordService,
    queryUsersRepository
);
