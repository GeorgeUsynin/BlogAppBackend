import 'reflect-metadata';
import { Container } from 'inversify';

// Application imports
import { AuthDeviceSessionsService } from './security/application';
import { AuthService } from './auth/application';
import { APIRateLimitService } from './apiRateLimit/application';
import { BlogsService } from './blogs/application';
import { CommentsService } from './comments/application';
import { LikesService } from './likes/application';
import { PasswordService } from './auth/application';
import { PostsService } from './posts/application';
import { RegistrationService } from './auth/application';
import { UsersService } from './users/application';
import { JWTService } from './shared/application/services';

// Controller imports
import { AuthController } from './auth/api/authController';
import { BlogsController } from './blogs/api/blogsController';
import { CommentsController } from './comments/api/commentsController';
import { PostsController } from './posts/api/postsController';
import { SecurityController } from './security/api/securityController';
import { UsersController } from './users/api/usersController';

// Infrastructure imports
import { APIRateLimitRepository } from './apiRateLimit/infrastructure';
import { AuthDeviceSessionsRepository, AuthDeviceSessionsQueryRepository } from './security/infrastructure';
import { BlogsRepository, QueryBlogsRepository } from './blogs/infrastructure';
import { CommentsRepository, QueryCommentsRepository } from './comments/infrastructure';
import { EmailAdapter } from './shared/infrastructure';
import { LikesRepository } from './likes/infrastructure';
import { PostsRepository, QueryPostsRepository } from './posts/infrastructure';
import { QueryUsersRepository, UsersRepository } from './users/infrastructure';

// Manager imports
import { EmailManager } from './shared/application/managers/emailManager';

class SingletonContainer {
    static #instance: Container;

    private constructor() {}

    public static get instance(): Container {
        if (!SingletonContainer.#instance) {
            SingletonContainer.#instance = new Container();
        }
        return SingletonContainer.#instance;
    }
}

export const container: Container = SingletonContainer.instance;

// Bindings
container.bind(APIRateLimitRepository).toSelf();
container.bind(APIRateLimitService).toSelf();
container.bind(AuthDeviceSessionsQueryRepository).toSelf();
container.bind(AuthDeviceSessionsRepository).toSelf();
container.bind(AuthDeviceSessionsService).toSelf();
container.bind(AuthController).toSelf();
container.bind(AuthService).toSelf();
container.bind(BlogsController).toSelf();
container.bind(BlogsRepository).toSelf();
container.bind(BlogsService).toSelf();
container.bind(CommentsController).toSelf();
container.bind(CommentsRepository).toSelf();
container.bind(CommentsService).toSelf();
container.bind(EmailAdapter).toSelf();
container.bind(EmailManager).toSelf();
container.bind(JWTService).toSelf();
container.bind(LikesRepository).toSelf();
container.bind(LikesService).toSelf();
container.bind(PasswordService).toSelf();
container.bind(PostsController).toSelf();
container.bind(PostsRepository).toSelf();
container.bind(PostsService).toSelf();
container.bind(QueryBlogsRepository).toSelf();
container.bind(QueryCommentsRepository).toSelf();
container.bind(QueryPostsRepository).toSelf();
container.bind(QueryUsersRepository).toSelf();
container.bind(RegistrationService).toSelf();
container.bind(SecurityController).toSelf();
container.bind(UsersController).toSelf();
container.bind(UsersRepository).toSelf();
container.bind(UsersService).toSelf();
