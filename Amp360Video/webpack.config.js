const path = require("path");

var APP_DIR = path.resolve(__dirname, "./src");
var BUILD_DIR = path.resolve(__dirname, "./dist");
var DEV_DIR = path.resolve(__dirname, "./.temp");

 var buildConfig = function(env) {
    var isProd = env.production;
    return {
        context: __dirname,
        entry: APP_DIR + "/amp-360video.ts",
        output: {
            path: isProd ? BUILD_DIR : DEV_DIR,
            publicPath: "/",
            filename: "amp-360video.js"
        },
        devtool: isProd ? false : "source-map",
        resolve: {
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            }]
        },
        mode: isProd ? "production" : "development"
    };
 }

module.exports = buildConfig;