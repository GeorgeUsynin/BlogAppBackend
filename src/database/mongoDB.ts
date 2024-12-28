import { MongoClient, Db, Collection } from 'mongodb';
import { SETTINGS } from '../app-settings';
import { TDatabase } from './types';

export let client: MongoClient;
export let db: Db;
export let blogsCollection: Collection<TDatabase.TBlog>;
export let postsCollection: Collection<TDatabase.TPost>;
export let commentsCollection: Collection<TDatabase.TComment>;
export let usersCollection: Collection<TDatabase.TUser>;
export let authDeviceSessionsCollection: Collection<TDatabase.TDevice>;
export let apiRateLimitCollection: Collection<TDatabase.TAPIRateLimit>;

export const connectToDatabase = async (url: string, dbName: string) => {
    if (db) {
        console.log('Database was restored from cache!');
        return true;
    }

    client = new MongoClient(url);

    try {
        await client.connect();

        //Db and collections creation
        db = client.db(dbName);
        blogsCollection = db.collection(SETTINGS.DB_COLLECTIONS.blogsCollection);
        postsCollection = db.collection(SETTINGS.DB_COLLECTIONS.postsCollection);
        commentsCollection = db.collection(SETTINGS.DB_COLLECTIONS.commentsCollection);
        usersCollection = db.collection(SETTINGS.DB_COLLECTIONS.usersCollection);
        authDeviceSessionsCollection = db.collection(SETTINGS.DB_COLLECTIONS.authDeviceSessionsCollection);
        apiRateLimitCollection = db.collection(SETTINGS.DB_COLLECTIONS.apiRateLimitCollection);

        await db.command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
        return true;
    } catch (err) {
        await client.close();
        console.dir(err);
        return false;
    }
};
