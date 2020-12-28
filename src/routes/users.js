const Router = require("koa-router");
const { find, list } = require("../services/users");

const router = new Router();

router.get("/", async (ctx) => {
  const data = await list();
  ctx.body = data;
});

router.get("/:guid", async (ctx) => {
  const user = await find({ guid: ctx.params.guid });
  if (user) {
    ctx.body = user;
  }
});

module.exports = router;
