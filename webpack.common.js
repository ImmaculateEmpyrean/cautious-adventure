module.exports = {
	entry: {
		index: "./src/www/index.js",
		vendor: "./src/www/vendor.js",
		tableDislay: "./src/www/tableDisplay.js",
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
