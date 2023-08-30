import * as mongoDB from "mongodb";
import keys from "../../keys";

export const collections: {
    tickets?: mongoDB.Collection
} = {}

export async function connectToDatabase() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(keys.DB_CONN_STRING);
    await client.connect();

    const db: mongoDB.Db = client.db(keys.DB_NAME);
    const ticketsCollection: mongoDB.Collection = db.collection('tickets');

    collections.tickets = ticketsCollection;

    console.log(`[database.service]`, `Successfully connected to database: ${db.databaseName}`);
}