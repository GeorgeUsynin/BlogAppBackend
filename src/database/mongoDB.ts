import { MongoClient, Db, Collection } from 'mongodb';
import { SETTINGS } from '../app-settings';

export namespace TDatabase {
    export type TBlog = {
        name: string;
        description: string;
        websiteUrl: string;
    };

    export type TPost = {
        title: string;
        shortDescription: string;
        content: string;
        blogId: string;
        blogName: string;
    };
}

export let client: MongoClient;
export let db: Db;
export let blogsCollection: Collection<TDatabase.TBlog>;
export let postsCollection: Collection<TDatabase.TPost>;

export const connectToDatabase = async (url: string, dbName: string) => {
    client = new MongoClient(url);

    try {
        await client.connect();

        //Db and collections creation
        db = client.db(dbName);
        blogsCollection = await db.createCollection(SETTINGS.DB_COLLECTIONS.blogsCollection);
        postsCollection = await db.createCollection(SETTINGS.DB_COLLECTIONS.postsCollection);

        await db.command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
        return true;
    } catch (err) {
        await client.close();
        console.dir(err);
        return false;
    }
};
