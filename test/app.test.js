const request = require("supertest");
const app = require("../src/app");
const dbHandler = require("../src/services/dbHandler");

beforeAll(async () => {
  await dbHandler.connect();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

test("App works", async () => {
  const response = await request(app().callback()).get("/");
  expect(response.status).toBe(200);
  expect(response.text).toBe("Ok");
});
