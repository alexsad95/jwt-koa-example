const Koa = require("koa");
const Router = require("koa-router");
const jwtMiddleware = require("koa-jwt");
const config = require("config");
// const mongoose = require("mongoose");

const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");

function App() {
  // mongoose.connect(config.get("App.dbConfig.uri"), {
  //   useUnifiedTopology: true,
  //   useNewUrlParser: true,
  //   useCreateIndex: true,
  // });

  // const { connection } = mongoose;

  // connection.once("open", () => {
  //   console.log("\nMongoDB database connection established successfully\n");
  // });

  const app = new Koa();
  const router = new Router();

  router.get("/", async (ctx) => {
    ctx.body = "Ok";
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
