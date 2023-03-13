import request from 'supertest'
import {app} from "../setting";
import {HTTP_STATUSES} from "../src/http_statuses";
import {blogsControl} from "../src/repositories/repository-blogs";



const testBlogData = {
    "name": "CorrectedName",
    "description": "CorrectedName",
    "websiteUrl": "https://corrected-url"
}

describe('/blogsTest_path_1', () => {

    it('GET, should return blogs[]', async () => {
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUSES.OK200)
    })

    it('Post, created blog', async () => {
        await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send(testBlogData)
            .expect(HTTP_STATUSES.CREATED_201)

    })

    it('Post, created blog no auth user', async () => {
        console.log('test4')
        await request(app)
            .post('/blogs')
            .send(testBlogData)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it('Post, try created blog with invalid value', async () => {
        await request(app)
            .post('/blogs')
            .send({...testBlogData, name: ''})
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })



    it('PUT, trying to change blog with invalid body', async () => {
        const arrBlog = await blogsControl.getAllBlogs()
        const firstElement = await arrBlog[0]
        await request(app)
            .put('/blogs/' + firstElement?.id)
            .auth('admin', 'qwerty', {type: "basic"})
            .send({
                "name": 123,
                "description": 123,
                "websiteUrl": "asddsLGzrfwn6vjvT5sasdasd"
            })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })

    it('DELETE, trying remove blogs with wrong id', async () => {
        await request(app)
            .delete('/blogs/' + 111)
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.NOT_FOUND)
    })


    afterAll(async () => {
        await request(app).delete('/testing/all-data')
    })
})
describe('/blogsTest_path_2',  () => {
    let arrBlog
    let firstElement:any
    beforeAll(async () => {
        await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: "basic"})
            .send(testBlogData)
    })

    it('GET, try should return blog by id', async () => {
        arrBlog = await blogsControl.getAllBlogs()
        firstElement = await arrBlog[0]
        await request(app)
            //@ts-ignore
            .get('/blogs/' + firstElement.id)
            //@ts-ignore
            .expect(HTTP_STATUSES.OK200, {...firstElement, _id: firstElement._id.toString()})
    })

    it('PUT, success trying to change blog', async () => {
        await request(app)
            .put('/blogs/' + firstElement.id)
            .auth('admin', 'qwerty', {type: "basic"})
            .send({...testBlogData, name: "ChangeName"})
            .expect(HTTP_STATUSES.NO_CONTENT)
    })


    it('DELETE, successful remove blogs', async () => {
        await request(app)
            .delete('/blogs/' + firstElement.id)
            .auth('admin', 'qwerty', {type: "basic"})
            .expect(HTTP_STATUSES.NO_CONTENT)
    })
})