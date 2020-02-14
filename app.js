const express = require("express");
const routes = require("./routes/index");
const bundler = require("./lib/bundler");
bundler.bundle();

bundler.on("buildEnd", () => {
  const app = express();

  app.use("/", routes);
  app.use(express.static("public"));

  const port = process.env.port || 3000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
});
