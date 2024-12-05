import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { SETTINGS } from '../app-settings';

export namespace TDatabase {
    export type TBlog = {
        _id: ObjectId;
        name: string;
        description: string;
        websiteUrl: string;
        createdAt: string;
        isMembership: boolean;
    };

    export type TPost = {
        _id: ObjectId;
        title: string;
        shortDescription: string;
        content: string;
        blogId: string;
        blogName: string;
        createdAt: string;
    };

    export type TComment = {
        _id: ObjectId;
        content: string;
        commentatorInfo: {
            userId: string;
            userLogin: string;
        };
        createdAt: string;
        postId: string;
    };

    export type TUser = {
        _id: ObjectId;
        login: string;
        email: string;
        passwordHash: string;
        createdAt: string;
    };
}

export let client: MongoClient;
export let db: Db;
export let blogsCollection: Collection<TDatabase.TBlog>;
export let postsCollection: Collection<TDatabase.TPost>;
export let commentsCollection: Collection<TDatabase.TComment>;
export let usersCollection: Collection<TDatabase.TUser>;
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

        await db.command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
        return true;
    } catch (err) {
        await client.close();
        console.dir(err);
        return false;
    }
};
