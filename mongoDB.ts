import {MongoClient} from "mongodb";
import dotenv from 'dotenv'
import {BlogType, PostType} from "./src/types";

dotenv.config()

const mongoURi = process.env.MONGO_URL|| "mongodb://127.0.0.1:27017"
const client = new MongoClient(mongoURi)
const myDB = client.db("myDB")
export const postCollections = myDB.collection<PostType>("posts")
export const blogCollections = myDB.collection<BlogType>("blogs")

export async function runDB() {
    try {
        await client.connect()
    } catch {
        // await client.close()
    }

}