const Bundler = require("parcel-bundler");
const path = require("path");

const files = [path.resolve("src/index.html")];

const options = {
  outDir: "public/dist",
  publicUrl: "./dist/",
  watch: process.env.NODE_ENV !== "production",
  minify: process.env.NODE_ENV === "production"
};

const bundler = new Bundler(files, options);
module.exports = bundler.bundle.bind(bundler);
