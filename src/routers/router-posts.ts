import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../http_statuses";
import {postsControl} from "../repositories/repository-posts";
import {postValidations} from "../validator/validators";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {authorizationGuard} from "../middleware/authorization-guard";


export const postsRouter = Router({})

//-------------------GET---------------//
postsRouter.get('/', async (req: Request, res: Response) => {
    const posts = await postsControl.getAllPosts()
    res.status(HTTP_STATUSES.OK200).send(posts)
})
postsRouter.get('/:id', async (req: Request, res: Response) => {
    const findBlog = await postsControl.getPostById(req.params.id)
    if (findBlog) {
        res.status(HTTP_STATUSES.OK200).send(findBlog)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
    }
})
//-------------------POST---------------//
postsRouter.post('/', authorizationGuard, postValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const newPost = await postsControl.createPost(req.body)
    if (newPost) {
        res.status(HTTP_STATUSES.CREATED_201).send(newPost)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
    }
})
//-------------------PUT---------------//
postsRouter.put('/:id', authorizationGuard, postValidations, inputValidationMiddleware, async (req: Request, res: Response) => {
    const isChangePost = await postsControl.changePost(req.params.id, req.body)
    if (isChangePost) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
    }
})
//-------------------DELETE---------------//
postsRouter.delete('/:id', authorizationGuard, async (req: Request, res: Response) => {
    const isDeleted = await postsControl.deletePost(req.params.id)
    if (isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
    }
})
