const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");
const production = process.env.NODE_ENV === "production";

const pages = fs.readdirSync("./pages", { withFileTypes: true })
	.filter(dirent => dirent.isDirectory())
	.map(e => e.name);

const generateEntryPoints = entry => entry.reduce((res, page) => ({
	...res,
	[page]: [path.resolve("pages", page, "entrypoint.tsx")]
}), {});

const generateHtml = entry => entry.map(page => new HtmlWebpackPlugin({
	chunks: [page],
	filename: `../views/pages/${page}.html`,
	template: path.join("pages", "template.ejs")
}));

module.exports = {
	watch: true,
	watchOptions: {
		aggregateTimeout: 200,
		poll: 1000,
	},
	stats: "minimal",
	entry: {
		...generateEntryPoints(pages),
		vendor: ["react", "react-dom"]
	},
	output: {
		path: production ? path.resolve(__dirname, "dist", "static", "public") : path.resolve(__dirname, "static", "public"),
		filename: production ? "js/[chunkhash].js" : "js/[name].js",
		publicPath: "public/",
		clean: true, // Cleans the output directory before each build.
	},
	devtool: "source-map",
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: "ts-loader" },
			{ test: /\.ejs$/, loader: "raw-loader" },
			{
				test: /\.(scss|css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				],
				generator: {
					publicPath: "public/",
				},
			},
			{
				test: /\.(jpg|jpeg|png|gif)$/,
				type: "asset/resource",
				generator: {
					publicPath: "//img/",
					outputPath: "img/"
				}
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
				type: "asset/resource",
				generator: {
					publicPath: "//fonts/",
					outputPath: "fonts/"
				}
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: production ? "css/[contentHash].css" : "css/[id].css",
			chunkFilename: production ? "css/[contentHash].css" : "css/[id].css"
		}),
		...generateHtml(pages)
	]
};