import mongoose from 'mongoose';
import { MongoClient, Db, Collection } from 'mongodb';
import { SETTINGS } from '../app-settings';
import { TDatabase } from './types';

export let client: MongoClient;
export let db: Db;
export let apiRateLimitCollection: Collection<TDatabase.TAPIRateLimit>;

export const connectToDatabase = async (url: string, dbName: string) => {
    if (db) {
        console.log('Database was restored from cache!');
        return true;
    }

    client = new MongoClient(url);

    try {
        await client.connect();
        await mongoose.connect(url, { dbName });

        //Db and collections creation
        db = client.db(dbName);
        apiRateLimitCollection = db.collection(SETTINGS.DB_COLLECTIONS.apiRateLimitCollection);

        await db.command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
        return true;
    } catch (err) {
        await client.close();
        await mongoose.disconnect();
        console.dir(err);
        return false;
    }
};
