const request = require("supertest")
const app = require("../index")
const { User, Photo, Comment } = require("../models")

const dataUser1 = {
    // id: 1,
    full_name: "user1",
    email: "user1@mail.com",
    username: "user1",
    password: "rahasia",
    profile_image_url: "www.freepik.com",
    age: 20,
    phone_number: "081234567890"
}

const dataUser2 = {
    // id: 2,
    full_name: "user2",
    email: "user2@mail.com",
    username: "user2",
    password: "rahasia",
    profile_image_url: "www.freepik.com",
    age: 20,
    phone_number: "081234567890"
}

const dataPhoto1 = {
    id: 1,
    title: "photo1",
    caption: "caption1",
    poster_image_url: "www.freepik.com"
}

const dataPhoto2 = {
    id: 2,
    title: "photo2",
    caption: "caption2",
    poster_image_url: "www.freepik.com"
}

const registerAndLogin = async() => {
    let token
    try {
        await User.create(dataUser1)
        await User.create(dataUser2)
        const login = await request(app)
        .post("/users/login")
        .send({
            email: dataUser1.email,
            password: dataUser1.password
        })
        token = login.body.token
    } catch (error) {
        console.log(error);
    }
    return token;
}

const createPhotos = async() => {
    await Photo.create({
        // id: dataPhoto1.id,
        title: dataPhoto1.title,
        caption: dataPhoto1.caption,
        poster_image_url: dataPhoto1.poster_image_url,
        UserId: 1
    })

    await Photo.create({
        // id: dataPhoto2.id,
        title: dataPhoto2.title,
        caption: dataPhoto2.caption,
        poster_image_url: dataPhoto2.poster_image_url,
        UserId:2
    })

    // const data = await Photo.findAll()
    // console.log("data", data);
}

const createComments = async() => {
    await Comment.create({
        // id: 1,
        comment: "komen1",
        PhotoId: 1,
        UserId: 1
    })
    await Comment.create({
        // id: 2,
        comment: "komen2",
        PhotoId: 2,
        UserId: 2
    })
}

const destroyUserData = async () => {
    try {
      await User.destroy({
        where: {},
        truncate: true,
        cascade: true,
        restartIdentity: true,
      })
    } catch (error) {
      console.log(error);
    }
}

const destroyPhotoData = async () => {
    try {
      await Photo.destroy({
        where: {},
        truncate: true,
        cascade: true,
        restartIdentity: true,
      })
    } catch (error) {
      console.log(error);
    }
}

const destroyCommentData = async () => {
    try {
      await Comment.destroy({
        where: {},
        truncate: true,
        cascade: true,
        restartIdentity: true,
      })
    } catch (error) {
      console.log(error);
    }
}

let token;

beforeEach(async () => {
    // const before = await Photo.findAll()
    // console.log("before", before);

    token = await registerAndLogin();
    await createPhotos();
    await createComments();
    
    // const after = await Photo.findAll()
    // console.log("after", after);
})

afterEach(async () => {
    await destroyUserData();
    await destroyPhotoData();
    await destroyCommentData();
})

describe("POST /comments/", () => {
    // let token;

    // beforeAll(async() => {
    //     token = await registerAndLogin()
    //     await createPhotos()
    // })

    it("Should be response 401 || not authenticated", (done) => {
        request(app)
        .post("/comments")
        .send({
            comment: "komen1",
            PhotoId: 1
        })
        .expect(401)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toEqual("Not Authenticated. You need to log in to view this content")
            expect(res.body).not.toHaveProperty("comment")
            done()
        })
    })

    it("Should be response 201", (done) => {
        request(app)
        .post("/comments")
        .set('token', token)
        .send({
            comment: "komen1",
            PhotoId: 1
        })
        .expect(201)
        .end((err, res) => {
            if(err) done(err)

            expect(res.body).toHaveProperty("comment")
            expect(res.body.comment).toHaveProperty("id")
            expect(res.body.comment).toHaveProperty("comment")
            expect(res.body.comment).toHaveProperty("UserId")
            expect(res.body.comment).toHaveProperty("PhotoId")
            done()
        })
    })

    // afterAll(async() => {
    //     // await destroyData()
    //     await destroyUserData();
    //     await destroyPhotoData();
    //     await destroyCommentData();
    // })
})

describe("GET /comments/", () => {
    // let token

    // beforeAll(async() => {
    //     token = await registerAndLogin()
    //     await createPhotos()
    //     await createComments()
    // })

    it("Should be response 401 || not authenticated", (done) => {
        request(app)
        .get("/comments")
        .expect(401)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toEqual("Not Authenticated. You need to log in to view this content")
            expect(res.body).not.toHaveProperty("comments")
            done()
        })
    })

    it("Should be response 200", (done) => {
        request(app)
        .get("/comments")
        .set('token', token)
        .expect(200)
        .end((err, res) => {
            if(err) done(err)

            expect(res.body).toHaveProperty("comments")
            expect(res.body.comments).toBeInstanceOf(Array)
            res.body.comments.forEach(comment => {
                expect(comment).toHaveProperty("id");
                expect(comment).toHaveProperty("UserId");
                expect(comment).toHaveProperty("PhotoId");
                expect(comment).toHaveProperty("comment");
            });
            done()
        })
    })

    // afterAll(async() => {
    //     // await destroyData()
    //     await destroyUserData();
    //     await destroyPhotoData();
    //     await destroyCommentData();
    // })
})

describe("PUT /comments/:commentId", () => {
    // let token
    const wrongId = 2;
    const correctId = 1;
    const invalidId = 10
    const loggedId = 1;
    const newComment = { comment: "komen baru"}

    // beforeAll(async() => {
    //     token = await registerAndLogin()
    //     await createPhotos()
    //     await createComments()
    // })

    it("Should be response 404 || comment not found", (done) => {
        request(app)
        .put(`/comments/${invalidId}`)
        .set('token', token)
        .send(newComment)
        .expect(404)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toStrictEqual("Comment not found.")
            expect(res.body).not.toHaveProperty("comment")
            done()
        })
    })

    it("Should be response 403 || not authorized", (done) => {
        request(app)
        .put(`/comments/${wrongId}`)
        .set('token', token)
        .send(newComment)
        .expect(403)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toStrictEqual("You don't have permission to update this comment.")
            expect(res.body).not.toHaveProperty("comment")
            done()
        })
    })

    it("Should be response 401 || not authenticated", (done) => {
        request(app)
        .put(`/comments/${correctId}`)
        .send(newComment)
        .expect(401)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toStrictEqual("Not Authenticated. You need to log in to view this content")
            expect(res.body).not.toHaveProperty("comment")
            done()
        })
    })

    it("Should be response 200", (done) => {
        request(app)
        .put(`/comments/${correctId}`)
        .set('token', token)
        .send(newComment)
        .expect(200)
        .end((err, res) => {
            if(err) done(err)

            expect(res.body).toHaveProperty("comment")
            expect(res.body.comment).toHaveProperty("id")
            expect(res.body.comment).toHaveProperty("comment")
            expect(res.body.comment).toHaveProperty("UserId")
            expect(res.body.comment).toHaveProperty("PhotoId")
            expect(res.body.comment.UserId).toStrictEqual(loggedId)
            done()
        })
    })

    // afterAll(async() => {
    //     // await destroyData()
    //     await destroyUserData();
    //     await destroyPhotoData();
    //     await destroyCommentData();
    // })
})

describe("DELETE /comments/:commentId", () => {
    // let token
    const wrongId = 2;
    const correctId = 1;
    const invalidId = 10

    // beforeAll(async() => {
    //     token = await registerAndLogin()
    //     await createPhotos()
    //     await createComments()
    // })

    it("Should be response 404 || comment not found", (done) => {
        request(app)
        .delete(`/comments/${invalidId}`)
        .set('token', token)
        .expect(404)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toStrictEqual("Comment not found.")
            expect(res.body).not.toHaveProperty("comment")
            done()
        })
    })

    it("Should be response 403 || not authorized", (done) => {
        request(app)
        .delete(`/comments/${wrongId}`)
        .set('token', token)
        .expect(403)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toStrictEqual("You don't have permission to delete this comment.")
            expect(res.body).not.toHaveProperty("comment")
            done()
        })
    })

    it("Should be response 401 || not authenticated", (done) => {
        request(app)
        .delete(`/comments/${correctId}`)
        .expect(401)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toStrictEqual("Not Authenticated. You need to log in to view this content")
            expect(res.body).not.toHaveProperty("comment")
            done()
        })
    })

    it("Should be response 200", (done) => {
        request(app)
        .delete(`/comments/${correctId}`)
        .set('token', token)
        .expect(200)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toEqual("Your comment has been successfully deleted")
            expect(res.body).not.toHaveProperty("comment")
            done()
        })
    })
    
    // afterAll(async() => {
    //     // await destroyData()
    //     await destroyUserData();
    //     await destroyPhotoData();
    //     await destroyCommentData();
    // })
})