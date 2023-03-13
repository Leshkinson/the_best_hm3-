import {app} from "../setting";
import {HTTP_STATUSES} from "../src/http_statuses";
import request from 'supertest'
import {blogsControl} from "../src/repositories/repository-blogs";
import {postsControl} from "../src/repositories/repository-posts";

const testNewPost = {
    "title": "123",
    "shortDescription": "new post",
    "content": "new post",
    "blogId": "2"
}

describe('/test_posts_path_1', () => {

    it('GET, should return posts[]', async () => {
        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK200)
    })

    it('POST, trying to create post unauthorized', async () => {
        await request(app)
            .post('/posts')
            .send(testNewPost)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('POST, trying to create post with exist blog id', async () => {
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({...testNewPost, blogId: "5"})
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                "errorsMessages": [
                    {
                        "message": "No blog!",
                        "field": "blogId"
                    }
                ]
            })
    })

    it('PUT, trying to change post with wrong id', async () => {
        await request(app)
            .put('/posts/' + 111)
            .auth('admin', 'qwerty', {type: "basic"})
            .send(testNewPost)
            .expect(HTTP_STATUSES.NOT_FOUND)
    })

    it('PUT, trying to change post unauthorized', async () => {
        await request(app)
            .put('/posts/' + 1)
            .send(testNewPost)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
})
let createdBlog: any
let createdPost: any
describe('test_posts_path_2', () => {

    const validDateForNewPost = {
        "title": "new post",
        "shortDescription": "new post",
        "content": "new post",
        "blogId": "1678704006288"
    }

    beforeAll(async () => {
        //@ts-ignore // ошибка типизации выше, изначально создание блога принимает 3 параметра
        await blogsControl.createBlog({
            "name": "somename",
            "websiteUrl": "https://milanac.ru/",
            "description": "description"
        })
            .then(async (el) => {
                createdBlog = el
            })


    })

    it('POST, trying to create post', async () => {
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send({...validDateForNewPost, blogId: createdBlog.id})
            .expect(HTTP_STATUSES.CREATED_201)
    })
})

describe('test_posts_path_3', () => {
    beforeAll(async () => {
        await postsControl.getAllPosts().then((el) => {
            createdPost = el[0]
        })
    })

    it('PUT, trying to change post with not valid body', async () => {
        console.log("createdBlog", createdBlog)
        await request(app)
            .put('/posts/' + createdPost.id)
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                "title": 123,
                "shortDescription": "",
                "content": 1234,
                "blogId": "123"
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                "errorsMessages": [
                    {
                        "message": "Invalid type",
                        "field": "title"
                    },
                    {
                        "message": "Not correct length",
                        "field": "shortDescription"
                    },
                    {
                        "message": "Invalid type",
                        "field": "content"
                    },
                    {
                        "message": "No blog!",
                        "field": "blogId"
                    }
                ]
            })
    })


    it('DELETE, trying remove post with wrong id', async () => {
        await request(app)
            .delete('/posts/' + 111)
            .auth('admin', 'qwerty', {type: "basic"})
            .send(testNewPost)
            .expect(HTTP_STATUSES.NOT_FOUND)
    })
})

describe('test_post_path_4', () => {
    it('DELETE, successful remove posts', async () => {
        await request(app)
            .delete('/posts/' + createdPost.id)
            .auth('admin', 'qwerty', {type: "basic"})
            .send(testNewPost)
            .expect(HTTP_STATUSES.NO_CONTENT)
    })
    it('DELETE, successful remove blog (in Post)', async () => {
        await request(app)
            .delete('/blogs/' + createdBlog.id)
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.NO_CONTENT)
    })
})