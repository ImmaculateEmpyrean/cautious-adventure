module.exports = {
	entry: {
		index: "./src/www/index.js",
		vendor: "./src/www/vendor.js"
	},
	module: {
		rules: [
			{
				test: /\.html/,
				use: ["html-loader"],
			},
		],
	},
};
