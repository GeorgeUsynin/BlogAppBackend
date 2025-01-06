import { injectable } from 'inversify';
import { TUser, UserModel } from '../domain';

@injectable()
export class UsersRepository {
    async findUserByLoginOrEmail(login: string, email: string) {
        return UserModel.findOne({ $or: [{ login }, { email }] });
    }

    async findUserByLogin(login: string) {
        return UserModel.findOne({ login });
    }

    async findUserByEmail(email: string) {
        return UserModel.findOne({ email });
    }

    async findUserById(id: string) {
        return UserModel.findById(id);
    }

    async findUserByConfirmationEmailCode(code: string) {
        return UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
    }

    async findUserByRecoveryPasswordCode(code: string) {
        return UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
    }

    async updateUserEmailConfirmation(id: string, isConfirmed: boolean) {
        return UserModel.findByIdAndUpdate(id, { 'emailConfirmation.isConfirmed': isConfirmed });
    }

    async updateUserEmailConfirmationCode(id: string, code: string, expirationDate: Date) {
        return UserModel.findByIdAndUpdate(id, {
            'emailConfirmation.confirmationCode': code,
            'emailConfirmation.expirationDate': expirationDate,
        });
    }

    async updateUserRecoveryPasswordCode(id: string, code: string, expirationDate: Date) {
        return UserModel.findByIdAndUpdate(id, {
            'passwordRecovery.recoveryCode': code,
            'passwordRecovery.expirationDate': expirationDate,
        });
    }

    async updatePasswordHash(id: string, passwordHash: string) {
        return UserModel.findByIdAndUpdate(id, { passwordHash });
    }

    async createUser(newUser: TUser) {
        return UserModel.create(newUser);
    }

    async deleteUserById(id: string) {
        return UserModel.findByIdAndDelete(id);
    }
}
