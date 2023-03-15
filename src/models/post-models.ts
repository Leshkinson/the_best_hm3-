import {PostType} from "../types";


export const postModels = (posts: PostType | PostType[]): PostType | PostType[] => {
    const postConverter = (post:PostType) => {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }
    if (Array.isArray(posts)){
        return posts.map(ps => postConverter(ps))

    }
    return postConverter(posts)
}