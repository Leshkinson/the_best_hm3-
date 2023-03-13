import {app} from "../setting";
import {HTTP_STATUSES} from "../src/http_statuses";
import {postsControl} from "../src/repositories/repository-posts";
import request from 'supertest'

const testNewPost = {
    "title": "123",
    "shortDescription": "new post",
    "content": "new post",
    "blogId": "2"
}

describe('/posts', () => {

    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it('GET, should return posts[]', async () => {
        await request(app)
            .get('/posts')
            .expect(HTTP_STATUSES.OK200, [...postsControl.getAllPosts()])
    })

    it('POST, trying to create post unauthorized', async () => {
        await request(app)
            .post('/posts')
            .send(testNewPost)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })
    it('POST, trying to create post', async () => {
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: "basic"})
            .send(testNewPost)
            .expect(HTTP_STATUSES.CREATED_201)


        const lastElement = postsControl.getAllPosts().length - 1
        expect(postsControl.getAllPosts()[lastElement].content).toBe("new post")
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

    it('PUT, trying to change post with not valid body', async () => {
        await request(app)
            .put('/posts/' + 2)
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                "title": 123,
                "shortDescription": "",
                "content": 1234,
                "blogId": "5"
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

    it('PUT, success trying to change post', async () => {
        await request(app)
            .put('/posts/' + 1)
            .auth('admin', 'qwerty', {type: "basic"})
            .send(testNewPost)
            .expect(HTTP_STATUSES.NO_CONTENT)
    })

    it('DELETE, trying remove post with wrong id', async () => {
        const arrLength = postsControl.getAllPosts().length
        await request(app)
            .delete('/posts/' + 111)
            .auth('admin', 'qwerty', {type: "basic"})
            .send(testNewPost)
            .expect(HTTP_STATUSES.NOT_FOUND)

        await request(app)
            .get('/posts')
        expect(arrLength).toBe(arrLength)
    })

    it('DELETE, successful remove posts', async () => {
        await request(app)
            .delete('/posts/' + 1)
            .auth('admin', 'qwerty', {type: "basic"})
            .send(testNewPost)
            .expect(HTTP_STATUSES.NO_CONTENT)
    })
})