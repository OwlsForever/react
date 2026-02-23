const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");
const production = process.env.NODE_ENV === "production";
const AddCharsetWebpackPlugin = require("add-charset-webpack-plugin");

const pages = fs.readdirSync("./pages", { withFileTypes: true })
	.filter(dirent => dirent.isDirectory())
	.map(e => e.name);

const generateEntryPoints = entry => entry.reduce((res, page) => ({
	...res,
	[page]: [path.resolve("pages", page, "entrypoint.tsx")]
}), {});

const generateHtml = entry => entry.map(page => new HtmlWebpackPlugin({
	chunks: [page],
	filename: production ? `${page}.html` : `../views/pages/${page}.html`,
	template: path.join("pages", "template.ejs")
}));

module.exports = {
	watch: !production,
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
		path: production ? path.resolve(__dirname, "build") : path.resolve(__dirname, "static", "public"),
		filename: production ? "js/[chunkhash].js" : "js/[name].js",
		publicPath: production ? "" : "public/",
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
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: "../"
						}
					},
					"css-loader",
					"sass-loader"
				],
			},
			{
				test: /\.(jpg|jpeg|png|gif)$/,
				type: "asset/resource",
				generator: {
					filename: production ? "img/[hash][ext]" : "img/[name][ext]",
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
		new AddCharsetWebpackPlugin({ charset: "utf-8" }),
		new MiniCssExtractPlugin({
			filename: production ? "css/[name].css" : "css/[id].css",
			chunkFilename: production ? "css/[id].css" : "css/[id].css"
		}),
		...generateHtml(pages)
	]
};