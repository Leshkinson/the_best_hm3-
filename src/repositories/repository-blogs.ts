import {BlogType} from "../types";
import {blogCollections, postCollections} from "../../mongoDB";

// export let arrBlogs: BlogType[] = [{
//     id: "1",
//     name: "Andrey",
//     description: "just men",
//     websiteUrl: "https://milanac.ru/"
// },
//     {
//         id: "2",
//         name: "Anton",
//         description: "super men",
//         websiteUrl: "https://milanac.ru/"
//     },
//     {
//         id: "3",
//         name: "Aleksandr",
//         description: "bad men",
//         websiteUrl: "https://milanac.ru/"
//     }]


export const blogsControl = {
    async getAllBlogs(): Promise<BlogType[]> {
        return blogCollections.find({}).toArray()
    },
    async getBlogById(id: string): Promise<BlogType | null> {
        return blogCollections.findOne({id: id})
    },
    async createBlog(body: BlogType): Promise<BlogType> {
        const newBlog = {
            id: (+(new Date())).toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        await blogCollections.insertOne(newBlog)
        return newBlog
    },
    async changeBlog(id: string, body: BlogType): Promise<boolean> {
        const {name, description, websiteUrl} = body
        const result = await blogCollections.updateOne({id: id}, {name, description, websiteUrl})
        return result.matchedCount === 1;

    },
    async deleteBlog(id: string) {
        const result = await blogCollections.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAllBlogs() {
        await blogCollections.deleteMany({})
    }
}