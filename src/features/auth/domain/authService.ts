import bcrypt from 'bcrypt';
import { usersRepository } from '../../users/repository';

export const authService = {
    login: async (loginOrEmail: string, password: string) => {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail, loginOrEmail);

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
