// const request = require("supertest");
// const app = require("../src/app");
// const prepareToken = require("./utils/prepareToken");

// const req = request(app().callback());

// // TODO добавить тестовые данные в бд
// test("User can succesfully login and get new refresh token", async () => {
//   const res = await req.post("/auth/login").send({
//     login: "user",
//     password: "user",
//   });
//   expect(res.status).toBe(200);
//   expect(typeof res.body.token).toBe("string");
//   expect(typeof res.body.refreshToken).toBe("string");

//   const refreshTokenRes = await req.post("/auth/refresh").send({
//     refreshToken: res.body.refreshToken,
//   });
//   expect(refreshTokenRes.status).toBe(200);
//   expect(typeof refreshTokenRes.body.token).toBe("string");
//   expect(typeof refreshTokenRes.body.refreshToken).toBe("string");
// });

// test("User gets 403 on invalid credentials", async () => {
//   const res = await req.post("/auth/login").send({
//     login: "INVALID_LOGIN",
//     password: "INVALID_PASSWORD",
//   });
//   expect(res.status).toBe(403);
// });

// test("User receives 401 on expired token", async () => {
//   const expiredToken = prepareToken({ id: 1 }, { expiresIn: "1ms" });
//   const res = await req.get("/users").set("Authorization", `Bearer ${expiredToken}`);
//   expect(res.status).toBe(401);
// });

test.todo("User может получить access token с помощью refresh token");
test.todo("User получает 404 для неправельного refresh token");
test.todo("User может использовать refresh token один раз");
test.todo("Refresh token станет инвалидным при logout");
test.todo("Возможность множественного использования refresh token");
