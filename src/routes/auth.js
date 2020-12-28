const config = require("config");
const jwt = require("jsonwebtoken");
const { compareSync } = require("bcryptjs");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const jwtMiddleware = require("koa-jwt");
const uuid = require("uuid").v4;

const userService = require("../services/users");
const refreshTokenService = require("../services/refreshToken");

const router = new Router();
const secret = config.get("App.jwtConfig.secret");

async function issueTokenPair(guid) {
  const newRefreshToken = uuid();
  const res = await refreshTokenService.add({
    refreshToken: newRefreshToken,
    guid,
  });
  return {
    token: jwt.sign({ guid, jwtId: res.id }, secret),
    refreshToken: newRefreshToken,
  };
}

router.post("/login", bodyParser(), async (ctx) => {
  const { login, password } = ctx.request.body;
  const user = await userService.find({ login });
  if (!user || !compareSync(password, user.password)) {
    const error = new Error();
    error.status = 403;
    throw error;
  }
  ctx.body = await issueTokenPair(user.guid);
});

router.post("/register", bodyParser(), async (ctx) => {
  const { login, password } = ctx.request.body;
  const user = await userService.find({ login });
  if (user) {
    const error = new Error();
    error.status = 403;
    throw error;
  }
  const res = await userService.add({ login, password });
  if (res) ctx.body = await issueTokenPair(res.guid);
});

router.post("/refresh", bodyParser(), jwtMiddleware({ secret }), async (ctx) => {
  const { refreshToken } = ctx.request.body;
  const { guid, jwtId } = ctx.state.user;
  const dbToken = await refreshTokenService.find({ guid, _id: jwtId });
  if (!dbToken) return;
  if (!compareSync(refreshToken, dbToken.refreshToken)) return;
  await refreshTokenService.remove({ guid, _id: jwtId });
  ctx.body = await issueTokenPair(guid);
});

router.post("/logout", jwtMiddleware({ secret }), async (ctx) => {
  const { guid } = ctx.state.user;
  await refreshTokenService.remove({ guid });
  ctx.body = { success: true };
});

module.exports = router;
