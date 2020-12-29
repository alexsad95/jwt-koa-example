const Koa = require("koa");
const Router = require("koa-router");
const jwtMiddleware = require("koa-jwt");
const config = require("config");
const mongoose = require("mongoose");
const dbHandler = require("./services/dbHandler");

const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");

function App() {
  if (process.env.NODE_ENV === "production") {
    dbHandler.connect();
    mongoose.connection.on("error", (err) => {
      console.log("error:\n", err);
    });
    mongoose.connection.on("open", () => {
      console.log("\nMongoDB database connection established successfully\n");
    });
  }

  const app = new Koa();
  const router = new Router();

  router.get("/", async (ctx) => {
    ctx.body = "Ok";
  });

  router.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
    }
  });
  router.use("/auth", authRoute.routes());
  router.use(
    jwtMiddleware({
      secret: config.get("App.jwtConfig.secret"),
    }),
  );

  router.use("/users", usersRoute.routes());

  app.use(router.allowedMethods());
  app.use(router.routes());

  return app;
}

if (require.main === module) {
  App().listen(config.get("App.appConfig.port"), () => {
    console.log(`\nServer is running on Port: ${config.get("App.appConfig.port")}\n`);
  });
}

module.exports = App;
