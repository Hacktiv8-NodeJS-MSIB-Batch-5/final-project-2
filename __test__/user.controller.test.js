const request = require("supertest");
const app = require("../index");
const { User } = require("../models");
const userTestData = require("../testdata/user.json")

const dataUser = userTestData.normal[0];
const dataUser2 = userTestData.normal[1];
const testingLoginData1 = userTestData.login[0];
const testingLoginData2 = userTestData.login[1];

const correctUserId = 1;
const wrongUserId = 2;
const outOfRangeId = 1000;

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

let token;
beforeAll(async () => {
  token = await addUserDataAndLogin();
})

afterAll(async () => {
  await destroyUserData();
})

describe("POST /users/register", () => {
  const dataRegist = userTestData.normal[2];
  const dataUserTidakLengkap = userTestData.incomplete;

  it("should be response 201 and equal to the data given", (done) => {
    request(app)
    .post("/users/register")
    .send(dataRegist)
    .expect(201)
    .end((err, res) => {
      if (err) done(err)

      expect(res.body).toHaveProperty("user")
      const user = res.body.user
      expect(user).toHaveProperty("email")
      expect(user).toHaveProperty("full_name")
      expect(user).toHaveProperty("username")
      expect(user).toHaveProperty("profile_image_url")
      expect(user).toHaveProperty("age")
      expect(user).toHaveProperty("phone_number")
      expect(user.email).toEqual(dataRegist.email)
      expect(user.full_name).toEqual(dataRegist.full_name)
      expect(user.username).toEqual(dataRegist.username)
      expect(user.profile_image_url).toEqual(dataRegist.profile_image_url)
      expect(user.age).toEqual(dataRegist.age)
      expect(user.phone_number).toEqual(dataRegist.phone_number)

      done()
    })
  })
  it("should be response 500 || email used is not unique", (done) => {
    request(app)
    .post("/users/register")
    .send(dataRegist)
    .expect(500)
    .end((err, res) => {
      if (err) done(err)

      expect(res.body).toHaveProperty("error")
      expect(res.body).toHaveProperty("message")
      expect(res.body.message).toHaveProperty("email")
      expect(res.body).toHaveProperty("name")
      expect(res.body.name).toStrictEqual("SequelizeUniqueConstraintError")
      
      done();
    })
  })
  it("should be response 500 || incomplete user registration data", (done) => {
    request(app)
    .post("/users/register")
    .send(dataUserTidakLengkap)
    .expect(500)
    .end((err, res) => {
      if (err) done(err)

      expect(res.body).toHaveProperty("error")
      expect(res.body).toHaveProperty("name")
      expect(res.body.name).toStrictEqual("SequelizeValidationError")  
      expect(res.body).toHaveProperty("message")
      expect(res.body.message).toHaveProperty("full_name")
      expect(res.body.message).toHaveProperty("profile_image_url")
      expect(res.body.message).toHaveProperty("age")
      expect(res.body.message).toHaveProperty("phone_number")

      done();
    })
  })
  // afterAll(async () => {
  //   try {
  //     await User.destroy({
  //       where: {},
  //       truncate: true,
  //       cascade: true,
  //       restartIdentity: true,
  //    })
  //   } catch (error) {
  //     console.log(error);
  //   }
  // })
})

describe("POST /users/login", () => {
  // beforeAll(async () => {
  //   try{
  //     await User.create(dataUser)
  //   } catch (err) {
  //     console.log(err);
  //   }
  // })
  it("should be response 201", (done) => {
    request(app)
    .post("/users/login")
    .send({
      email: dataUser.email,
      password: dataUser.password
    })
    .expect(200)
    .end((err, res) => {
      if (err) done(err)

      expect(res.body).toHaveProperty("token")
      expect(Object.keys(res.body)).toHaveLength(1)
      expect(res.body.token).toBeTruthy()
      expect(typeof res.body.token).toEqual("string")
      expect(typeof res.body.token).not.toStrictEqual("integer")

      done()
    })
  })
  it("should be response 400 || email not found", (done) => {
    request(app)
    .post("/users/login")
    .send(testingLoginData2)
    .expect(400)
    .end((err, res) => {
      if (err) done (err)

      const messageStr = "Cannot find user with email '" + testingLoginData2.email + "'";
      expect(res.body).not.toHaveProperty("token")
      expect(res.body).toHaveProperty("message")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toBeTruthy()
      expect(res.body.message).toStrictEqual(messageStr)

      done()
    })
  })
  it("should be response 401 || wrong password", (done) => {
    request(app)
    .post("/users/login")
    .send(testingLoginData1)
    .expect(401)
    .end((err, res) => {
      if (err) done (err)

      const messageStr = "Wrong password!";
      expect(res.body).not.toHaveProperty("token")
      expect(res.body).toHaveProperty("message")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toBeTruthy()
      expect(res.body.message).toStrictEqual(messageStr)

      done()
    })
  })
  // afterAll(async () => {
  //   await destroyUserData();
  // })
})

describe("PUT /users/:userId", () => {
  const updatedDataUser = {
    email: dataUser.email,
    full_name: "updated_user1",
    username: dataUser.username,
    profile_image_url: dataUser.profile_image_url,
    age: dataUser.age,
    phone_number: dataUser.phone_number
  }

  // let token;
  // beforeAll(async () => {
  //   token = await addUserDataAndLogin();
  // })
  it("should be response 200 and equal to the data given", (done) => {
    request(app)
    .put(`/users/${correctUserId}`)
    .set('token', token)
    .send(updatedDataUser)
    .expect(200)
    .end((err, res) => {
      if (err) done(err);

      expect(res.body).toHaveProperty("message")
      expect(res.body.message).toEqual("User Updated Successfully")
      expect(res.body).toHaveProperty("user")
      expect(Object.keys(res.body.user)).toHaveLength(6)
      expect(res.body.user).toStrictEqual(updatedDataUser)

      done()
    })
  })
  it("should be response 401 || not authenticated", (done) => {
    request(app)
    .put(`/users/${correctUserId}`)
    .send(updatedDataUser)
    .expect(401)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(1)
      expect(res.body).toHaveProperty("message")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("Not Authenticated. You need to log in to view this content")
      expect(res.body).not.toHaveProperty("user")

      done()
    })
  })
  it("should be response 403 || not authorized", (done) => {
    request(app)
    .put(`/users/${wrongUserId}`)
    .set('token', token)
    .send(updatedDataUser)
    .expect(403)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(2)
      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("error")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("You are not authorized to perform this action")
      expect(res.body).not.toHaveProperty("user")

      done()
    })
  })
  it("should be response 404 || user not found", (done) => {
    request(app)
    .put(`/users/${outOfRangeId}`)
    .set('token', token)
    .send(updatedDataUser)
    .expect(404)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(2)
      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("error")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("User not found")
      expect(res.body).not.toHaveProperty("user")

      done();
    })
  })
  // afterAll(async () => {
  //   await destroyUserData();
  // })
})

describe("DELETE /users/:userId", () => {
  // let token;
  // beforeAll(async () => {
  //   token = await addUserDataAndLogin();
  // })
  it("should be response 200 and equal to the data given", (done) => {
    request(app)
    .delete(`/users/${correctUserId}`)
    .set('token', token)
    .expect(200)
    .end((err, res) => {
      if (err) done(err);

      expect(Object.keys(res.body)).toHaveLength(1)
      expect(res.body).toHaveProperty("message")
      expect(res.body).toBeTruthy()
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("Your account has been successfully deleted")

      done()
    })
  })
  it("should be response 401 || not authenticated", (done) => {
    request(app)
    .delete(`/users/${correctUserId}`)
    .expect(401)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(1)
      expect(res.body).toHaveProperty("message")
      expect(res.body.message).toBeTruthy()
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("Not Authenticated. You need to log in to view this content")

      done()
    })
  })
  it("should be response 403 || not authorized", (done) => {
    request(app)
    .delete(`/users/${wrongUserId}`)
    .set('token', token)
    .expect(403)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(2)
      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("error")
      expect(res.body.message).toBeTruthy();
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("You are not authorized to perform this action")

      done()
    })
  })
  it("should be response 404 || user not found", (done) => {
    request(app)
    .delete(`/users/${outOfRangeId}`)
    .set('token', token)
    .expect(404)
    .end((err, res) => {
      if(err) done(err)

      expect(Object.keys(res.body)).toHaveLength(2)
      expect(res.body).toHaveProperty("message")
      expect(res.body).toHaveProperty("error")
      expect(res.body.message).toBeTruthy();
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toStrictEqual("User not found")

      done()
    })
  })
  
  // afterAll(async () => {
  //   await destroyUserData();
  // })
})