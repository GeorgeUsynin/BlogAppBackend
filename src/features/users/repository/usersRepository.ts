import { ObjectId } from 'mongodb';
import { TDatabase } from '../../../database';
import { TUser, UserModel } from '../domain';

export const usersRepository = {
    async findUserByLoginOrEmail(login: string, email: string) {
        return UserModel.findOne({ $or: [{ login }, { email }] });
    },
    async findUserByLogin(login: string) {
        return UserModel.findOne({ login });
    },
    async findUserByEmail(email: string) {
        return UserModel.findOne({ email });
    },
    async findUserById(id: string) {
        return UserModel.findById(id);
    },
    async findUserByConfirmationCode(code: string) {
        return UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
    },
    async updateUserEmailConfirmation(id: string, isConfirmed: boolean) {
        return UserModel.findByIdAndUpdate(id, { 'emailConfirmation.isConfirmed': isConfirmed });
    },
    async updateUserEmailConfirmationCode(id: string, code: string, expirationDate: Date) {
        return UserModel.findByIdAndUpdate(id, {
            'emailConfirmation.confirmationCode': code,
            'emailConfirmation.expirationDate': expirationDate,
        });
    },
    async createUser(newUser: TUser) {
        return UserModel.create(newUser);
    },
    async deleteUserById(id: string) {
        return UserModel.findByIdAndDelete(id);
    },
};
