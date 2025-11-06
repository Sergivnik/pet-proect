const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "API/public"),
    filename: isDevelopment ? "[name].bundle.js" : "[name].[contenthash].js",
    publicPath: "/", // важно для React Router
    clean: true,
  },
  devtool: isDevelopment ? "eval-source-map" : "source-map",
  devServer: isDevelopment
    ? {
        port: 8080,
        hot: true,
        open: true,
        compress: true,
        historyApiFallback: {
          index: '/index.html',
          disableDotRule: true, // важно для URL с точками
        },
        static: {
          directory: path.resolve(__dirname, "API/public"),
        },
        devMiddleware: {
          publicPath: '/',
        },
        proxy: {
          '/API': 'http://localhost:80', // проксируем API на Node
        },
        headers: {
          "Content-Security-Policy": "default-src 'self' blob: data:; worker-src 'self' blob:; connect-src 'self' ws://localhost:8080 http://localhost:80",
        },
      }
    : undefined,
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              isDevelopment && require.resolve("react-refresh/babel"),
              ["@babel/plugin-transform-class-properties", { loose: true }],
            ].filter(Boolean),
          },
        },
      },
      {
        test: /\.s?css$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      filename: "index.html",
    }),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
};
