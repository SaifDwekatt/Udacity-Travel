import path from "path"
import HtmlWebPackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import WorkboxPlugin from "workbox-webpack-plugin"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  mode: "production",
  entry: "./src/client/index.js",
  optimization: {
    minimizer: [new TerserPlugin({}), new CssMinimizerPlugin()],
  },
  output: {
    libraryTarget: "var",
    library: "Client",
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/client/views/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
    new WorkboxPlugin.GenerateSW(),
  ],
}

