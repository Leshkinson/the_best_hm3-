import {BlogType} from "../types";


export const blogsModels = (blogs: BlogType[] | BlogType): BlogType | BlogType[] => {
    const blogConverter = (blog: BlogType) => {
        return {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }
    if (Array.isArray(blogs)) {
        return blogs.map(bl => blogConverter(bl))
    }
    return blogConverter(blogs)
}