const express = require("express");
const routes = require("./routes/index");
const runBundle = require("./lib/bundler");

const app = express();

app.use("/", routes);
app.use(express.static("public"));

runBundle();

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
