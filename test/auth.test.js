const request = require("supertest");
const app = require("../src/app");
const prepareToken = require("./utils/prepareToken");
const dbHandler = require("./utils/dbHandler");

const req = request(app().callback());
let globalUser;

beforeAll(async () => {
  await dbHandler.connect();
});

beforeEach(async () => {
  const user = await req.post("/auth/register").send({
    login: "testUser",
    password: "password",
  });
  globalUser = { token: user.body.token, refreshToken: user.body.refreshToken };
});

afterEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("Check \"auth\" logic", () => {
  test("User can succesfully login and get new refresh token", async () => {
    const res = await req.post("/auth/login").send({
      login: "testUser",
      password: "password",
    });

    expect(res.status).toBe(200);
    expect(typeof res.body.token === "string").toBeTruthy();
    expect(typeof res.body.refreshToken === "string").toBeTruthy();

    const refreshTokenRes = await req.post("/auth/refresh").send({
      refreshToken: res.body.refreshToken,
    }).set("Authorization", `Bearer ${res.body.token}`);

    expect(refreshTokenRes.status).toBe(200);
    expect(typeof refreshTokenRes.body.token === "string").toBeTruthy();
    expect(typeof refreshTokenRes.body.refreshToken === "string").toBeTruthy();
  });

  test("User gets 403 on invalid credentials", async () => {
    const res = await req.post("/auth/login").send({
      login: "INVALID_LOGIN",
      password: "INVALID_PASSWORD",
    });
    expect(res.status).toBe(403);
  });

  test("User receives 401 on expired token", async () => {
    const expiredToken = prepareToken({ guid: "test" }, { expiresIn: "1ms" });
    const res = await req.get("/users").set("Authorization", `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
  });

  test("User can get new access token using refresh token", async () => {
    const refreshTokenRes = await req.post("/auth/refresh").send({
      refreshToken: globalUser.refreshToken,
    }).set("Authorization", `Bearer ${globalUser.token}`);
    expect(refreshTokenRes.status).toBe(200);
    expect(typeof refreshTokenRes.body.token === "string").toBeTruthy();
    expect(typeof refreshTokenRes.body.refreshToken === "string").toBeTruthy();
  });

  test("User get 404 on invalid refresh token", async () => {
    const res = await req.post("/auth/refresh").send({
      refreshToken: "INVALID_REFRESH_TOKEN",
    }).set("Authorization", `Bearer ${globalUser.token}`);
    expect(res.status).toBe(404);
  });

  test("User can use refresh token only once", async () => {
    const firstResponse = await req.post("/auth/refresh").send({
      refreshToken: globalUser.refreshToken,
    }).set("Authorization", `Bearer ${globalUser.token}`);
    expect(firstResponse.status).toBe(200);
    expect(typeof firstResponse.body.token === "string").toBeTruthy();
    expect(typeof firstResponse.body.refreshToken === "string").toBeTruthy();

    const secondResponse = await req.post("/auth/refresh").send({
      refreshToken: globalUser.refreshToken,
    }).set("Authorization", `Bearer ${globalUser.token}`);
    expect(secondResponse.status).toBe(404);
  });

  test("Refresh tokens become invalid on logout", async () => {
    const logoutRes = await req
      .post("/auth/logout")
      .set("Authorization", `Bearer ${globalUser.token}`);

    expect(logoutRes.status).toBe(200);

    const res = await req.post("/auth/refresh").send({
      refreshToken: globalUser.refreshToken,
    });
    expect(res.status).toBe(401);
  });

  test("Multiple refresh tokens are valid", async () => {
    const firstLoginResponse = await req.post("/auth/login").send({
      login: "testUser",
      password: "password",
    });
    await req.post("/auth/register").send({
      login: "testUser2",
      password: "password2",
    });
    const secondLoginResponse = await req.post("/auth/login").send({
      login: "testUser2",
      password: "password2",
    });
    expect(firstLoginResponse.status).toBe(200);
    expect(secondLoginResponse.status).toBe(200);

    const firstRefreshResponse = await req.post("/auth/refresh").send({
      refreshToken: firstLoginResponse.body.refreshToken,
    }).set("Authorization", `Bearer ${firstLoginResponse.body.token}`);
    expect(firstLoginResponse.status).toBe(200);
    expect(typeof firstRefreshResponse.body.token === "string").toBeTruthy();
    expect(typeof firstRefreshResponse.body.refreshToken === "string").toBeTruthy();

    const secondRefreshResponse = await req.post("/auth/refresh").send({
      refreshToken: secondLoginResponse.body.refreshToken,
    }).set("Authorization", `Bearer ${secondLoginResponse.body.token}`);
    expect(secondRefreshResponse.status).toBe(200);
    expect(typeof secondRefreshResponse.body.token === "string").toBeTruthy();
    expect(typeof secondRefreshResponse.body.refreshToken === "string").toBeTruthy();
  });
});