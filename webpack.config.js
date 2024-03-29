const path = require(`path`);
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `docs`)
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `docs`),
    publicPath: `http://localhost:8080`,
    compress: true,
    watchContentBase: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [`style-loader`, `css-loader`],
      },
    ],
  },
  plugins: [
    // Оставим только одну локаль
    new MomentLocalesPlugin({
      localesToKeep: [`es-us`],
    }),
  ],
};
