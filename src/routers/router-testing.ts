import {Request, Response, Router} from "express";
import {postsControl} from "../repositories/repository-posts";
import {HTTP_STATUSES} from "../http_statuses";
import {blogsControl} from "../repositories/repository-blogs";

export const testingRouter = Router({})

    testingRouter.delete('/all-data', (req: Request, res: Response) => {
        blogsControl.deleteAllBlogs()
        postsControl.deleteAllPosts()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    })