import request from 'supertest'
import {app} from "../setting";
import {HTTP_STATUSES} from "../src/http_statuses";
import {postsControl} from "../src/repositories/repository-posts";
import {blogsControl} from "../src/repositories/repository-blogs";


const testBlogData = {
    "name": "string",
    "description": "string",
    "websiteUrl": "https://cTBu0tXl3ZLGzrfwn6vjvT5sCnR7ORtcBN4M9nWhfsPrAOIxjgE.7ovu57WGoigw.FluQDBkmr2aWiuLaoRcxwkwQlh9"
}

describe('/blogs', () => {

    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it('GET, should return blogs[]', async () => {
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK200, [...blogsControl.getAllBlogs()])
    })

    it('GET, should return blog bu id', async () => {
        await request(app)
            .get('/blogs/' + 1)
            .expect(HTTP_STATUSES.OK200, blogsControl.getBlogById('1'))
    })

    it('PUT, trying to change blog with not valid body', async () => {
        await request(app)
            .put('/blogs/' + 2)
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                "name": 123,
                "description": 123,
                "websiteUrl": "asddsLGzrfwn6vjvT5sasdasd"
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                "errorsMessages": [
                    {
                        "message": "Invalid type",
                        "field": "name"
                    },
                    {
                        "message": "Invalid type",
                        "field": "description"
                    },
                    {
                        "message": "Is not URL!",
                        "field": "websiteUrl"
                    }
                ]
            })
    })

    it('PUT, success trying to change blog', async () => {
        await request(app)
            .put('/blogs/' + 1)
            .auth('admin', 'qwerty', {type: "basic"})
            .send(testBlogData)
            .expect(HTTP_STATUSES.NO_CONTENT)
    })

    it('DELETE, trying remove blogs with wrong id', async () => {
        const arrLength = postsControl.getAllPosts().length
        await request(app)
            .delete('/blogs/' + 111)
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.NOT_FOUND)

        await request(app)
            .get('/blogs')
        expect(arrLength).toBe(arrLength)
    })

    it('DELETE, successful remove blogs', async () => {
        await request(app)
            .delete('/blogs/' + 1)
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.NO_CONTENT)
    })
})