import {PostType} from "../types";
import {blogsControl} from "./repository-blogs";
import {postCollections} from "../../mongoDB";


// export let arrPosts: PostType[] = [{
//     id: "1",
//     title: "Super title",
//     shortDescription: "bad men",
//     content: "little",
//     blogId: "3",
//     blogName: "Aleksandr"
// },
//     {
//         id: "2",
//         title: "Worse title",
//         shortDescription: "super men",
//         content: "long",
//         blogId: "2",
//         blogName: "Anton"
//     },
//     {
//         id: "3",
//         title: "just title",
//         shortDescription: "just men",
//         content: "just more",
//         blogId: "1",
//         blogName: "Andrey"
//     }]

export const postsControl = {
    async getAllPosts(): Promise<PostType[]> {
        return postCollections.find({}).toArray()
    },
    getPostById(id: string): Promise<PostType | null> {
        return postCollections.findOne({id: id})
    },
    async createPost(body: PostType): Promise<PostType | null> {
        const findBlog = await blogsControl.getBlogById(body.blogId)
        if (findBlog) {
            const newPost = {
                id: (+(new Date())).toString(),
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: findBlog.name
            }
            await postCollections.insertOne(newPost)
            return newPost
        } else {
            return null
        }
    },
    async changePost(id: string, body: PostType): Promise<boolean> {
        const {title, blogId, blogName, content, shortDescription} = body
        const result = await postCollections.updateOne({id: id}, {
            $set: {
                title,
                blogId,
                blogName,
                content,
                shortDescription
            }
        })
        const findBlog = await blogsControl.getBlogById(body.blogId)
        return !!(result.matchedCount === 1 && findBlog);

    },
    async deletePost(id: string) {
        const result = await postCollections.deleteOne({id: id})
        return result.deletedCount === 1

    },
    async deleteAllPosts() {
        await postCollections.deleteMany({})
    }

}