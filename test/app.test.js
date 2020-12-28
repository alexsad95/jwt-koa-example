const request = require("supertest");
const app = require("../src/app");

test("App works", async () => {
  const response = await request(app().callback()).get("/");
  expect(response.status).toBe(200);
  expect(response.text).toBe("Ok");
});
