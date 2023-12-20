const request = require("supertest");
const app = require("../index");
const { User, SocialMedia } = require("../models");
const userTestData = require("../testdata/user.json")
const socmedTestData = require("../testdata/socmed.json")

const dataUser = userTestData.normal[0]
const dataUser2 = userTestData.normal[1]

const dataSocMed = socmedTestData.normal[0]
const dataSocMed2 = socmedTestData.normal[1]

const correctSocmedId = 1;
const wrongSocmedId = 2;
const outOfRangeId = 1000;
const loggedUserId = 1;

const addUserDataAndLogin = async () => {
  let token;
  try{
    await User.create(dataUser)
    await User.create(dataUser2)
    const login = await request(app)
    .post("/users/login")
    .send({
      email: dataUser.email,
      password: dataUser.password
    });

    token = login.body.token
  } catch (err) {
    console.log(err);
  }
  return token;
}

const createSocmedData = async () => {
  try {
    await SocialMedia.create(dataSocMed)
    await SocialMedia.create(dataSocMed2)
  } catch (err) {
    console.log(err);
  }
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

const destroySocmedData = async () => {
  try {
    await SocialMedia.destroy({
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
  token = await addUserDataAndLogin();
  await createSocmedData();
  // console.log(token);
})

afterEach(async () => {
  await destroyUserData();
  await destroySocmedData();
})

describe("POST /socialmedias/", () => {
  const dataSocMedKosong = socmedTestData.empty

  // beforeAll(async () => {
  //   token = await addUserDataAndLogin();
  //   // console.log(token);
  // })

  it("should be response 201", (done) => {
    request(app)
    .post("/socialmedias")
    .set('token', token)
    .send({
      "name": "posted socmed",
      "social_media_url": "www.socmed.com"
    })
    .expect(201)
    .end((err, res) => {
      if(err) done(err)
      expect(res.body).toHaveProperty("socialmedia")
      expect(res.body.socialmedia).toHaveProperty("id")
      expect(res.body.socialmedia).toHaveProperty("name")
      expect(res.body.socialmedia).toHaveProperty("social_media_url")
      expect(res.body.socialmedia).toHaveProperty("UserId")
      expect(res.body.socialmedia).toHaveProperty("updatedAt")
      expect(res.body.socialmedia).toHaveProperty("createdAt")

      done()
    })
  })
  it("should be response 500 || validation error", (done) => {
    request(app)
    .post("/socialmedias")
    .set('token', token)
    .send(dataSocMedKosong)
    .expect(500)
    .end((err, res) => {
      if(err) done(err)

      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("error")
      expect(res.body).toHaveProperty("name")
      expect(res.body.name).toEqual("SequelizeValidationError")
      expect(res.body.message).toHaveProperty("name")
      expect(res.body.message).toHaveProperty("social_media_url")

      done()
    })
  })
  it("should be response 401 || not authenticated", (done) => {
    request(app)
    .put("/socialmedias")
    .send(dataSocMed)
    .expect(401)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(1)
      expect(res.body).toHaveProperty("message")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toEqual("Not Authenticated. You need to log in to view this content")
      expect(res.body).not.toHaveProperty("user")

      done()
    })
  })
  // afterAll(async () => {
  //   await destroyUserData();
  //   await destroySocmedData();
  // })
})

describe("GET /socialmedias/", () => {
  // let token;
  // beforeAll(async () => {
  //   token = await addUserDataAndLogin()
  //   await addSocmedData()
  // })

  it("should be response 200", (done) => {
    request(app)
    .get("/socialmedias")
    .set('token', token)
    .expect(200)
    .end((err, res) => {
      if(err) done(err)

      expect(res.body).toHaveProperty("social_medias")
      expect(res.body.social_medias).toHaveLength(1)
      expect(res.body.social_medias[0]).toHaveProperty("id")
      expect(res.body.social_medias[0]).toHaveProperty("name")
      expect(res.body.social_medias[0]).toHaveProperty("social_media_url")
      expect(res.body.social_medias[0]).toHaveProperty("UserId")
      expect(res.body.social_medias[0]).toHaveProperty("createdAt")
      expect(res.body.social_medias[0]).toHaveProperty("updatedAt")
      expect(res.body.social_medias[0]).toHaveProperty("User")
      expect(res.body.social_medias[0].User).toHaveProperty("id")
      expect(res.body.social_medias[0].User).toHaveProperty("username")
      expect(res.body.social_medias[0].User).toHaveProperty("profile_image_url")

      done()
    })
  })
  it("should be response 401 || not authenticated", (done) => {
    request(app)
    .get("/socialmedias")
    .expect(401)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(1)
      expect(res.body).toHaveProperty("message")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toEqual("Not Authenticated. You need to log in to view this content")
      expect(res.body).not.toHaveProperty("user")

      done()
    })
  })

  // afterAll(async () => {
  //   await destroyUserData();
  //   await destroySocmedData();
  // })
})

describe("PUT /socialmedias/:socialMediaId", () => {
  const updatedSocmed = socmedTestData.updated
  // let token;
  // beforeAll(async () => {
  //   token = await addUserDataAndLogin();
  //   await addSocmedData();
  // })

  it("should be response 200", (done) => {
    request(app)
    .put(`/socialmedias/${correctSocmedId}`)
    .set('token', token)
    .send(updatedSocmed)
    .expect(200)
    .end((err, res) => {
      if(err) done(err)

      expect(res.body).toHaveProperty("social_media")
      expect(res.body.social_media).toHaveProperty("id")
      expect(res.body.social_media.id).toStrictEqual(correctSocmedId)
      expect(res.body.social_media).toHaveProperty("name")
      expect(res.body.social_media.name).toStrictEqual(updatedSocmed.name)
      expect(res.body.social_media).toHaveProperty("social_media_url")
      expect(res.body.social_media.social_media_url).toStrictEqual(updatedSocmed.social_media_url)
      expect(res.body.social_media).toHaveProperty("UserId")
      expect(res.body.social_media.UserId).toStrictEqual(loggedUserId)
      expect(res.body.social_media).toHaveProperty("updatedAt")
      expect(res.body.social_media).toHaveProperty("createdAt")

      done()
    })
  })
  it("should be response 401 || not authenticated", (done) => {
    request(app)
    .put(`/socialmedias/${correctSocmedId}`)
    .send(updatedSocmed)
    .expect(401)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(1)
      expect(res.body).toHaveProperty("message")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("Not Authenticated. You need to log in to view this content")
      expect(res.body).not.toHaveProperty("social_media")

      done()
    })
  })
  it("should be response 403 || not authorized", (done) => {
    request(app)
    .put(`/socialmedias/${wrongSocmedId}`)
    .set('token', token)
    .send(updatedSocmed)
    .expect(403)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(2)
      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("error")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("You are not authorized to perform this action")
      expect(res.body).not.toHaveProperty("social_media")

      done()
    })
  })
  it("should be response 404 || socmed data not found", (done) => {
    request(app)
    .put(`/socialmedias/${outOfRangeId}`)
    .set('token', token)
    .send(updatedSocmed)
    .expect(404)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(2)
      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("error")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("Social Media data not found")
      expect(res.body).not.toHaveProperty("social_media")

      done()
    })
  })
  // afterAll(async () => {
  //   await destroyUserData();
  //   await destroySocmedData();
  // })
})

describe("DELETE /socialmedias/:socialMediaId", () => {
  // let token;
  // beforeAll(async () => {
  //   token = await addUserDataAndLogin();
  //   await addSocmedData();
  // })

  it("should be response 200", (done) => {
    request(app)
    .delete(`/socialmedias/${correctSocmedId}`)
    .set('token', token)
    .expect(200)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(1)
      expect(res.body).toHaveProperty("message")
      expect(res.body.message).toStrictEqual("Your social media has been successfully deleted")

      done();
    })
  })
  it("should be response 401 || not authenticated", (done) => {
    request(app)
    .delete(`/socialmedias/${correctSocmedId}`)
    .expect(401)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(1)
      expect(res.body).toHaveProperty("message")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("Not Authenticated. You need to log in to view this content")
      expect(res.body).not.toHaveProperty("social_media")

      done()
    })
  })
  it("should be response 403 || not authorized", (done) => {
    request(app)
    .delete(`/socialmedias/${wrongSocmedId}`)
    .set('token', token)
    .expect(403)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(2)
      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("error")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("You are not authorized to perform this action")
      expect(res.body).not.toHaveProperty("social_media")

      done()
    })
  })
  it("should be response 404 || socmed data not found", (done) => {
    request(app)
    .delete(`/socialmedias/${outOfRangeId}`)
    .set('token', token)
    .expect(404)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(2)
      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("error")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("Social Media data not found")
      expect(res.body).not.toHaveProperty("social_media")

      done();
    })
  })

  // afterAll(async () => {
  //   await destroyUserData();
  //   await destroySocmedData();
  // })
})