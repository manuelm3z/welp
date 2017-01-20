const NODE_ENV = process.env.NODE_ENV;

const isDev = NODE_ENV === 'development';
// alternatively, we can use process.argv[1]
// const isDev = (process.argv[1] || '')
//					.indexOf('hjs-dev-server') !== -1;

const webpack = require('webpack'), fs = require('fs'), path = require('path'), join = path.join, resolve = path.resolve;

const getConfig = require('hjs-webpack');

//Variables to optimize configuration
const root = resolve(__dirname), src = join(root, 'src'), modules = join(root, 'node_modules'), dest = join(root, 'dist');

let config = getConfig({
	in: join(src, 'app.js'),
	out: dest,
	clearBeforeBuild: true
});

config.postcss = [].concat([
	require('precss')({}),
	require('autoprefixer')({}),
	require('cssnano')({})
]);

module.exports = config;