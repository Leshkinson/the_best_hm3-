import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../http_statuses";
import {blogsControl} from "../repositories/repository-blogs";
import {blogValidations} from "../validator/validators";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {authorizationGuard} from "../middleware/authorization-guard";

export const blogsRouter = Router({})

//-------------------GET---------------//
blogsRouter.get('/', async(req: Request, res: Response) => {
    const blogs = await blogsControl.getAllBlogs()
    res.status(HTTP_STATUSES.OK200).send(blogs)
})
blogsRouter.get('/:id', async(req: Request, res: Response) => {
    const findBlog = await blogsControl.getBlogById(req.params.id)
    if (findBlog) {
        res.status(HTTP_STATUSES.OK200).send(findBlog)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
    }
})
//-------------------POST---------------//
blogsRouter.post('/', authorizationGuard, blogValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const newBlog = await blogsControl.createBlog(req.body)
    res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
})
//-------------------PUT---------------//
blogsRouter.put('/:id', authorizationGuard, blogValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const isChangeBlog = await blogsControl.changeBlog(req.params.id, req.body)
    if (isChangeBlog)
    {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT)
        return
    }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
})
//-------------------DELETE---------------//
blogsRouter.delete('/:id', authorizationGuard, async (req: Request, res: Response) => {
    const isDeleted = await blogsControl.deleteBlog(req.params.id)
    if (isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
    }
})