const request = require("supertest");
const app = require("../index");
const { User, SocialMedia } = require("../models");

const dataUser = {
  id: 1,
  full_name: "user1",
  email: "user@mail.com",
  username: "user1",
  password: "rahasia",
  profile_image_url: "www.freepik.com",
  age: 20,
  phone_number: "08123456789"
}

const dataUser2 = {
  id: 2,
  full_name: "user2",
  email: "user2@mail.com",
  username: "user2",
  password: "rahasia",
  profile_image_url: "www.freepik.com",
  age: 20,
  phone_number: "08123456789"
}

const dataSocMed = {
  id: 1,
  name: "Instagram",
  social_media_url: "www.instagram.com",
}

const dataSocMed2 = {
  id: 2,
  name: "Twitter",
  social_media_url: "www.twitter.com",
}

const addDataAndLogin = async () => {
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

const addSocmedData = async () => {
  await SocialMedia.create({
    id: dataSocMed.id,
    name: dataSocMed.name,
    social_media_url: dataSocMed.social_media_url,
    UserId: 1
  });

  await SocialMedia.create({
    id: dataSocMed2.id,
    name: dataSocMed2.name,
    social_media_url: dataSocMed2.social_media_url,
    UserId: 2
  });
}

const destroyData = async () => {
  try {
    await User.destroy({ where: {} })
    await SocialMedia.destroy({ where: {} })
  } catch (error) {
    console.log(error);
  }
}

describe("POST /socialmedias/", () => {
  let token;
  const correctId = dataUser.id;
  const dataSocMedKosong = {
    name: "",
    social_media_url: ""
  }

  beforeAll(async () => {
    token = await addDataAndLogin(app);
    // console.log(token);
  })

  it("should be response 201", (done) => {
    request(app)
    .post("/socialmedias")
    .set('token', token)
    .send(dataSocMed)
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
      expect(Number(res.body.socialmedia.UserId)).toEqual(correctId)

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
  afterAll(async () => {
    await destroyData();
  })
})

describe("GET /socialmedias/", () => {
  let token;

  beforeAll(async () => {
    token = await addDataAndLogin();
    await addSocmedData();
  })

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

  afterAll(async () => {
    await destroyData();
  })
})

describe("PUT /socialmedias/:socialMediaId", () => {
  let token;
  const wrongId = dataSocMed2.id;
  const correctId = dataSocMed.id;
  const loggedId = dataUser.id;

  const outOfRangeId = 1000;
  const updatedSocmed = {
    name: "edited instagram",
    social_media_url: "www.instagram.com"
  }

  beforeAll(async () => {
    token = await addDataAndLogin();
    await addSocmedData();
    // console.log(token);
  })

  it("should be response 200", (done) => {
    request(app)
    .put(`/socialmedias/${correctId}`)
    .set('token', token)
    .send(updatedSocmed)
    .expect(200)
    .end((err, res) => {
      if(err) done(err)

      expect(res.body).toHaveProperty("social_media")
      expect(res.body.social_media).toHaveProperty("id")
      expect(res.body.social_media.id).toStrictEqual(correctId)
      expect(res.body.social_media).toHaveProperty("name")
      expect(res.body.social_media).toHaveProperty("social_media_url")
      expect(res.body.social_media).toHaveProperty("UserId")
      expect(res.body.social_media.UserId).toStrictEqual(loggedId)
      expect(res.body.social_media).toHaveProperty("updatedAt")
      expect(res.body.social_media).toHaveProperty("createdAt")

      done()
    })
  })
  it("should be response 401 || not authenticated", (done) => {
    request(app)
    .put(`/socialmedias/${correctId}`)
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
    .put(`/socialmedias/${wrongId}`)
    .set('token', token)
    .send(updatedSocmed)
    .expect(403)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(1)
      expect(res.body).toHaveProperty("message")
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

      expect(Object.keys(res.body)).toHaveLength(1)
      expect(res.body).toHaveProperty("message")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("Social Media data not found")
      expect(res.body).not.toHaveProperty("social_media")

      done()
    })
  })
  afterAll(async () => {
    await destroyData();
  })
})

describe("DELETE /socialmedias/:socialMediaId", () => {
  let token;
  const wrongId = dataSocMed2.id;
  const correctId = dataSocMed.id;
  const outOfRangeId = 1000;
  const loggedId = dataUser.id;

  beforeAll(async () => {
    token = await addDataAndLogin();
    await addSocmedData();
  })

  it("should be response 200", (done) => {
    request(app)
    .delete(`/socialmedias/${correctId}`)
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
    .delete(`/socialmedias/${correctId}`)
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
    .delete(`/socialmedias/${wrongId}`)
    .set('token', token)
    .expect(403)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(1)
      expect(res.body).toHaveProperty("message")
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

      expect(Object.keys(res.body)).toHaveLength(1)
      expect(res.body).toHaveProperty("message")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("Social Media data not found")
      expect(res.body).not.toHaveProperty("social_media")

      done();
    })
  })

  afterAll(async () => {
    await destroyData();
  })
})