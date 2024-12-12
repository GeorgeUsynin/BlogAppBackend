import { ObjectId } from 'mongodb';
import { usersCollection, TDatabase } from '../../../database/mongoDB';

export const usersRepository = {
    async findUserByLoginOrEmail(login: string, email: string) {
        return usersCollection.findOne({ $or: [{ login }, { email }] });
    },
    async findUserById(id: string) {
        return usersCollection.findOne({ _id: new ObjectId(id) });
    },
    async createUser(newUser: Omit<TDatabase.TUser, '_id'>) {
        //@ts-expect-error since ObjectId will be created by MongoDB we don't need to pass it
        return usersCollection.insertOne(newUser);
    },
    async deleteUserById(id: string) {
        return usersCollection.findOneAndDelete({ _id: new ObjectId(id) });
    },
};
