const request = require("supertest");
const app = require("../src/app");
const prepareToken = require("./utils/prepareToken");
const dbHandler = require("./utils/dbHandler");
const usersService = require("../src/services/users");

const req = request.agent(app().callback());
const authLine = `Bearer ${prepareToken({ guid: "testGuid" })}`;

let userGuid;
const firstUser = {
  login: "testUser",
  password: "password",
};

const createProducts = async () => {
  const createdIphone = await usersService.add(firstUser);
  userGuid = createdIphone.guid;
};

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  await createProducts();
});

afterEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("Check \"user\" logic", () => {
  test("Should retrieve correct user if guid matches", async () => {
    const foundUser = await usersService.find({ guid: userGuid });
    expect(foundUser.guid).toBe(userGuid);
    expect(foundUser.login).toBe(firstUser.login);
  });

  test("Users list route", async () => {
    const res = await req.get("/users").set("Authorization", authLine);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body));
  });

  test("Get user by guid should be ok", async () => {
    const user = await usersService.find({ login: "testUser" });
    const res = await req.get(`/users/${user.guid}`).set("Authorization", authLine);
    expect(res.status).toBe(200);
    expect(res.body.login).toBe("testUser");
  });

  test("Get user by invalid id should be 404", async () => {
    const res = await req.get("/users/1111").set("Authorization", authLine);
    expect(res.status).toBe(404);
  });
});
