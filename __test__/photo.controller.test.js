const request = require("supertest")
const app = require("../index")
const { User, Photo } = require("../models")

const dataUser1 = {
    id: 1,
    full_name: "user1",
    email: "user1@mail.com",
    username: "user1",
    password: "rahasia",
    profile_image_url: "www.freepik.com",
    age: 20,
    phone_number: "081234567890"
}

const dataUser2 = {
    id: 2,
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
        id: dataPhoto1.id,
        title: dataPhoto1.title,
        caption: dataPhoto1.caption,
        poster_image_url: dataPhoto1.poster_image_url,
        UserId: 1
    })

    await Photo.create({
        id: dataPhoto2.id,
        title: dataPhoto2.title,
        caption: dataPhoto2.caption,
        poster_image_url: dataPhoto2.poster_image_url,
        UserId:2
    })
}

const destroyData = async() => {
    try {
        await User.destroy({ where: {} })
        await Photo.destroy({ where: {} })
    } catch (error) {
        console.log(error);
    }
}

describe("POST /photos/", () => {
    let token
    
    beforeAll(async () => {
        token = await registerAndLogin()
    })

    it("should be response 401 || not authenticated", (done) => {
        request(app)
        .post("/photos")
        .send(dataPhoto1)
        .expect(401)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body).not.toHaveProperty("title");
            expect(res.body).not.toHaveProperty("caption");
            expect(res.body).not.toHaveProperty("poster_image_url");
            // expect(res.body).not.toHaveProperty("user")
            done()
        })
    })

    it("Should be response 500 || validation error", (done) => {
        const dataInvalid = {
            title: "",
            caption: "",
            poster_image_url: "notaurl"
        }
        request(app)
        .post("/photos")
        .set('token', token)
        .send(dataInvalid)
        .expect(500)
        .end((err, res) => {
            if(err) done(err)

            expect(res.body).toHaveProperty("name")
            expect(typeof res.body.name).toEqual("string")
            expect(res.body.name).toEqual("SequelizeValidationError")
            expect(res.body).toHaveProperty("errors")
            expect(res.body.errors).toBeInstanceOf(Array)
            done()
        })
    })

    it("Should be response 201", (done) => {
        request(app)
        .post("/photos")
        .set('token', token)
        .send(dataPhoto1)
        .expect(201)
        .end((err, res) => {
            if(err) done(err)

            expect(res.body).toHaveProperty("data")
            expect(res.body.data).toHaveProperty("id")
            expect(res.body.data).toHaveProperty("title")
            expect(res.body.data).toHaveProperty("caption")
            expect(res.body.data).toHaveProperty("poster_image_url")
            expect(res.body.data).toHaveProperty("UserId")
            done()
        })
    })

    afterAll(async () => {
        await destroyData()
    })
})

describe("GET /photos/", () => {
    let token

    beforeAll(async() => {
        token = await registerAndLogin()
        await createPhotos()
    })

    it("Should be response 401 || not authenticated", (done) => {
        request(app)
        .get("/photos")
        .expect(401)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body).not.toHaveProperty("photos")
            expect(res.body.message).toEqual("Not Authenticated. You need to log in to view this content")
            done()
        })
    })

    it("Should be response 200", (done) => {
        request(app)
        .get("/photos")
        .set('token', token)
        .expect(200)
        .end((err, res) => {
            if(err) done(err)

            expect(res.body).toHaveProperty("photos")
            expect(res.body.photos).toBeInstanceOf(Array)
            res.body.photos.forEach(photo => {
                expect(photo).toHaveProperty("id");
                expect(photo).toHaveProperty("title");
                expect(photo).toHaveProperty("caption");
                expect(photo).toHaveProperty("poster_image_url");
            });
            done()
        })
    })

    afterAll(async () => {
        await destroyData()
    })
})

describe("PUT /photos/:photoId", () => {
    let token
    const correctId = dataPhoto1.id
    const wrongId = dataPhoto2.id
    const invalidId = 1000
    const loggedId = dataUser1.id

    const newDataPhoto = {
        title: "photo new",
        caption: "caption new",
        poster_image_url: "www.freepik.com"
    }

    beforeAll(async() => {
        token = await registerAndLogin()
        await createPhotos()
    })

    it("Should be response 404 || photo not found", (done) => {
        request(app)
        .put(`/photos/${invalidId}`)
        .set('token', token)
        .send(newDataPhoto)
        .expect(404)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toStrictEqual("Photo not found.")
            expect(res.body).not.toHaveProperty("photo")
            done()
        })
    })

    it("Should be response 403 || not authorized", (done) => {
        request(app)
        .put(`/photos/${wrongId}`)
        .set('token', token)
        .send(newDataPhoto)
        .expect(403)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toStrictEqual("You don't have permission to update this photo.")
            expect(res.body).not.toHaveProperty("photo")
            done()
        })
    })

    it("Should be response 401 || not authenticated", (done) => {
        request(app)
        .put(`/photos/${correctId}`)
        .send(newDataPhoto)
        .expect(401)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body).not.toHaveProperty("photo")
            expect(res.body.message).toEqual("Not Authenticated. You need to log in to view this content")
            done()
        })
    })

    it("Should be response 200", (done) => {
        request(app)
        .put(`/photos/${correctId}`)
        .set('token', token)
        .send(newDataPhoto)
        .expect(200)
        .end((err, res) => {
            if(err) done(err)

            expect(res.body).toHaveProperty("photo")
            expect(res.body.photo).toHaveProperty("id")
            expect(res.body.photo.id).toStrictEqual(correctId)
            expect(res.body.photo).toHaveProperty("title")
            expect(res.body.photo).toHaveProperty("caption")
            expect(res.body.photo).toHaveProperty("poster_image_url")
            expect(res.body.photo).toHaveProperty("UserId")
            expect(res.body.photo.UserId).toStrictEqual(loggedId)
            done()
        })
    })

    afterAll(async () => {
        await destroyData()
    })
})

describe("DELETE /photos/:photoId", () => {
    let token
    const correctId = dataPhoto1.id
    const wrongId = dataPhoto2.id
    const invalidId = 1000

    beforeAll(async() => {
        token = await registerAndLogin()
        await createPhotos()
    })

    it("Should be response 404 || photo not found", (done) => {
        request(app)
        .delete(`/photos/${invalidId}`)
        .set('token', token)
        .expect(404)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toStrictEqual("Photo not found.")
            expect(res.body).not.toHaveProperty("photo")
            done()
        })
    })

    it("Should be response 403 || not authorized", (done) => {
        request(app)
        .delete(`/photos/${wrongId}`)
        .set('token', token)
        .expect(403)
        .end((err, res) => {
            if(err) done(err)
            
            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toStrictEqual("You don't have permission to delete this photo.")
            expect(res.body).not.toHaveProperty("photo")
            done()
        })
    })

    it("Should be response 401 || not authenticated", (done) => {
        request(app)
        .delete(`/photos/${correctId}`)
        .expect(401)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toStrictEqual("Not Authenticated. You need to log in to view this content")
            expect(res.body).not.toHaveProperty("photo")
            done()
        })
    })

    it("Should be response 200", (done) => {
        request(app)
        .delete(`/photos/${correctId}`)
        .set('token', token)
        .expect(200)
        .end((err, res) => {
            if(err) done(err)

            expect(Object.keys(res.body)).toHaveLength(1)
            expect(res.body).toHaveProperty("message")
            expect(typeof res.body.message).toEqual("string")
            expect(res.body.message).toEqual("Your photo has been successfully deleted")
            expect(res.body).not.toHaveProperty("photo")
            done()
        })
    })
    
    afterAll(async () => {
        await destroyData()
    })
})