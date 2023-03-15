import {PostType} from "../types";
import {blogsControl} from "./repository-blogs";
import {postCollections} from "../../mongoDB";

export const postsControl = {
    async getAllPosts(): Promise<PostType[]> {
        return postCollections.find({}).toArray()
    },
    getPostById(id: string): Promise<PostType | null> {
        return postCollections.findOne({id: id})
    },
    async createPost(body: PostType): Promise<PostType > {
        const findBlog = await blogsControl.getBlogById(body.blogId)
            const newPost = {
                id: (+(new Date())).toString(),
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                //@ts-ignore
                blogName: findBlog.name,
                createdAt: new Date().toISOString()
            }
            await postCollections.insertOne(newPost)
            return newPost
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