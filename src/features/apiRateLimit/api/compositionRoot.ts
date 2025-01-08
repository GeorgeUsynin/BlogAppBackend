import 'reflect-metadata';
import { Container } from 'inversify';
import { APIRateLimitRepository } from '../infrastructure';
import { APIRateLimitService } from '../application';

export const container: Container = new Container();

container.bind(APIRateLimitRepository).toSelf();
container.bind(APIRateLimitService).toSelf();
