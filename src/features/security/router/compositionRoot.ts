import { AuthDeviceSessionsQueryRepository, AuthDeviceSessionsRepository } from '../repository';
import { AuthDeviceSessionsService } from '../domain';
import { SecurityController } from './securityController';

const authDeviceSessionsQueryRepository = new AuthDeviceSessionsQueryRepository();
const authDeviceSessionsRepository = new AuthDeviceSessionsRepository();

export const authDeviceSessionsService = new AuthDeviceSessionsService(authDeviceSessionsRepository);

export const securityController = new SecurityController(authDeviceSessionsService, authDeviceSessionsQueryRepository);
