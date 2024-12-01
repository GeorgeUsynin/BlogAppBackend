import { ObjectId } from 'mongodb';
import { usersCollection, TDatabase } from '../../../database/mongoDB';

export const usersRepository = {
    //@ts-expect-error since ObjectId will be created by MongoDB we don't need to pass it
    createUser: async (newUser: Omit<TDatabase.TUser, '_id'>) => usersCollection.insertOne(newUser),
    deleteUserById: async (id: ObjectId) => usersCollection.findOneAndDelete({ _id: id }),
};
