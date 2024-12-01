import { queryUsersRepository } from '../../users/repository';
import { usersService } from '../../users/domain';
export const authService = {
    login: async (loginOrEmail: string, password: string) => {
        const user = await queryUsersRepository.findUserByLoginOrEmail(loginOrEmail, loginOrEmail);

        if (!user) {
            return null;
        }

        const passwordHash = await usersService.generateHash(password, user.passwordSalt);

        if (passwordHash !== user.passwordHash) {
            return null;
        }

        return user;
    },
};
