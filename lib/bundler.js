const Bundler = require("parcel-bundler");
const path = require("path");

const files = [path.resolve("src/index.html")];

const options = {
  outDir: "public/dist",
  publicUrl: "./dist/"
};

const bundler = new Bundler(files, options);
module.exports = bundler;
