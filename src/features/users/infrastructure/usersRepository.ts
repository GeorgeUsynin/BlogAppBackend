import { injectable } from 'inversify';
import { TUser, UserDocument, UserModel } from '../domain';

@injectable()
export class UsersRepository {
    async findUserById(id: string) {
        return UserModel.findById(id);
    }

    async findUserByLoginOrEmail(login: string, email: string) {
        return UserModel.findOne({ $or: [{ login }, { email }] });
    }

    async findUserByLogin(login: string) {
        return UserModel.findOne({ login });
    }

    async findUserByEmail(email: string) {
        return UserModel.findOne({ email });
    }

    async findUserByConfirmationEmailCode(code: string) {
        return UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
    }

    async findUserByRecoveryPasswordCode(code: string) {
        return UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
    }

    async save(user: UserDocument) {
        return user.save();
    }
}
