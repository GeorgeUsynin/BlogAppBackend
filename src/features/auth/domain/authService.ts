import { queryUsersRepository } from '../../users/repository';
import bcrypt from 'bcrypt';

export const authService = {
    login: async (loginOrEmail: string, password: string) => {
        const user = await queryUsersRepository.findUserByLoginOrEmail(loginOrEmail, loginOrEmail);

        if (!user) {
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            return null;
        }

        return user;
    },
};
