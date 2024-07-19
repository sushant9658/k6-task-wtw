import path from "path";

export default {
  mode: "production",
  entry: "./src/test-script.js",
  output: {
    path: path.resolve(process.cwd(), "dist"), // eslint-disable-line
    libraryTarget: "commonjs",
    filename: "test.js",
  },
  module: {
    rules: [{ test: /\.js$/, use: "babel-loader" }],
  },
  target: "web",
  //   externals: /k6(\/.*)?/,
  externals: {
    k6: "k6",
    "k6/http": "k6/http",
    "k6/metrics": "k6/metrics",
    "k6/ws": "k6/ws",
    // Add more K6 modules if needed
  },
  resolve: {
    fallback: {
      stream: false,
      buffer: false,
    },
  },
};
