const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const path = require( "path" );

const common = {
	mode: "none",
	// mode: "production",
	output: {
		path: path.resolve( __dirname, "dist" ),
		filename: "[name].js",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.html$/i,
				loader: "html-loader",
			},
			{
				test: /\.(png|jpg|gif)$/i,
				type: "asset/resource",
			},
		],
	},
	resolve: {
		extensions: [ ".tsx", ".ts", ".js" ],
	},
	devtool: "source-map",
};

module.exports = [
/*
	{
		...common,
		entry: "./src/splash.ts",
		target: "web",
		plugins: [
			new HtmlWebpackPlugin({
				template: "./src/splash/index.html"
			}),
		],
	},
*/
	{
		...common,
		entry: {
			main: "./src/main.ts"
		},
		target: "electron-main",
	},
	{
		...common,
		entry: {
			renderer: "./src/renderer.ts"
		},
		target: "electron-renderer",
	},
];
