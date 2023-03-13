import express, {Request, Response, Router} from "express";
import bodyParser from "body-parser";
import {postsRouter} from "./src/routers/router-posts";
import {blogsRouter} from "./src/routers/router-blogs";
import {testingRouter} from "./src/routers/router-testing";

export const app = express()

app.use(bodyParser.json())
app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)
app.use('/testing', testingRouter)

