// const request = require("supertest");
// const app = require("../src/app");
// const prepareToken = require("./utils/prepareToken");
const dbHandler = require("./utils/dbHandler");
const usersService = require("../src/services/users");

// const app = request.agent(app().callback());
// const authLine = `Bearer ${prepareToken({ id: 1 })}`;

let userGuid;
const firstUser = {
  login: "testUser",
  password: "password",
};

const secondUser = {
  login: "testUser2",
  password: "password2",
};

/**
 * Seed the database with products.
 */
const createProducts = async () => {
  const createdIphone = await usersService.add(firstUser);
  userGuid = createdIphone.guid;
  await usersService.add(secondUser);
};

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
    await dbHandler.connect();
});

/**
 * Seed the database.
 */
beforeEach(async () => {
    await createProducts();
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => {
    await dbHandler.clearDatabase();
});

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
    await dbHandler.closeDatabase();
});

/**
 * Product getById test suite.
 */
describe("product getById ", () => {
    /**
     * Should return the correct product if getById finds the product with the provided id.
     */
    test("should retrieve correct product if id matches", async () => {
        const foundUser = await usersService.find({ guid: userGuid });

        const foundUsers = await usersService.list();
        console.log("foundUsers\n", foundUsers);

        expect(foundUser.guid).toBe(userGuid);
        expect(foundUser.login).toBe(firstUser.login);
    });

    // test("Users list", async () => {
    //   const res = await req.get("/users").set("Authorization", authLine);
    //   expect(res.status).toBe(200);
    //   expect(Array.isArray(res.body));
    // });

    // test("Get user by guid should be ok", async () => {
    //   const users = await usersService.list();
    //   console.log("users:\n", users);
    //   const user = await usersService.find({ login: "testUser" });
    //   console.log("user:\n", user);
    //   const res = await req.get(`/users/${user.guid}`).set("Authorization", authLine);
    //   expect(res.status).toBe(200);
    //   expect(res.body.login).toBe("user");
    // });

    // test("Get user by invalid id should be 404", async () => {
    //   const res = await req.get("/users/1111").set("Authorization", authLine);
    //   expect(res.status).toBe(404);
    // });
});
