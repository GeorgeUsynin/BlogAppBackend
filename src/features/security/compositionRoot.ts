import 'reflect-metadata';
import { Container } from 'inversify';
import { AuthDeviceSessionsQueryRepository, AuthDeviceSessionsRepository } from './infrastructure';
import { AuthDeviceSessionsService } from './application';
import { SecurityController } from './api/securityController';

export const container: Container = new Container();

container.bind(AuthDeviceSessionsQueryRepository).toSelf();
container.bind(AuthDeviceSessionsRepository).toSelf();
container.bind(AuthDeviceSessionsService).toSelf();
container.bind(SecurityController).toSelf();
