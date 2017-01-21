const NODE_ENV = process.env.NODE_ENV;

const isDev = NODE_ENV === 'development';
// alternatively, we can use process.argv[1]
// const isDev = (process.argv[1] || '')
//					.indexOf('hjs-dev-server') !== -1;

const webpack = require('webpack'),
	getConfig = require('hjs-webpack'),
	fs = require('fs'),
	path = require('path'),
	dotenv = require('dotenv');

const join = path.join,
	resolve = path.resolve;

//Variables to optimize configuration
const root = resolve(__dirname),
	src = join(root, 'src'),
	modules = join(root, 'node_modules'),
	dest = join(root, 'dist');

/**
 * Loading the variables is a pretty simple process using dotenv.
 * In our webpack.config.js file, let's load up the .env file in our
 * environment
 */
const dotEnvVars = dotenv.config(),
	// To load these files in our server
	enviromentEnv = dotenv.config({
		path: join(root, 'config', `${NODE_ENV}.config.js`),
		silent: true
	});

/**
 * We can merge these two objects together to allow the environment-based 
 * [env].config.js file to overwrite the global one using Object.assign()
 */
const envVariables = Object.assign({}, dotEnvVars, enviromentEnv);

/**
 * In our webpack.config.js file, let's use the reduce() method 
 * to create an object that contains conventional values in our source 
 * with their stringified values
 */
const defines = Object.keys(envVariables)
	.reduce((memo, key) => {
		const val = JSON.stringify(envVariables[key]);

		memo[`__${key.toUpperCase()}__`] = val;

		return memo;
	}, {
		__NODE_ENV__: JSON.stringify(NODE_ENV)
	});

let config = getConfig({
	in: join(src, 'app.js'),
	out: dest,
	clearBeforeBuild: true
});

/**
 * The defines object can now become the configuration object that the 
 * DefinePlugin() plugin expects to use to replace variables.
 * We'll prepend the existing webpack plugin list with our DefinePlugin()
 */
config.plugins = [
	new webpack.DefinePlugin(defines)
].concat(config.plugins);

config.postcss = [].concat([
	require('precss')({}),
	require('autoprefixer')({}),
	require('cssnano')({})
]);

const cssModulesNames = `${isDev ? '[path][name]__[local]__' : ''}[hash:base64:5]`;

const matchCssLoaders = /(^|!)(css-loader)($|!)/;

const findLoader = (loaders, match) => {
	const found = loaders.filter(l => l && l.loader && l.loader.match(match));

	return found ? found[0] : null;
}

//existing css loader
const cssloader = findLoader(config.module.loaders, matchCssLoaders);

//let's create a new loader as well as modify the existing loader to support loading css modules
const newLoader = Object.assign({}, cssloader, {
	test: /\.module\.css$/,
	include: [src],
	loader: cssloader.loader.replace(matchCssLoaders, `$1$2?modules&localIdentName=${cssModulesNames}$3`)
});

config.module.loaders.push(newLoader);

cssloader.test = new RegExp(`[^module]${cssloader.test.source}`);

cssloader.loader = newLoader.loader;

/**
 * In our new loader, we've modified the loading to only include css files in the src directory.
 * For loading any other css files, such as font awesome, we'll include another css loader for webpack to load without modules support
 */
config.module.loaders.push({
	test: /\.css$/,
	include: [modules],
	loader: 'style!css'
});

/**
 * Let's add the webpack root to be both the node_modules/ directory 
 * as well as the src/ directory. We can also set up a few aliases 
 * referencing the directories we previously created
 * 
 * In our source, instead of referencing our containers by relative path,
 * we can simply call require('containers/SOME/APP')
 */
config.resolve.root = [src, modules];

config.resolve.alias = {
	'css': join(src, 'styles'),
	'containers': join(src, 'containers'),
	'components': join(src, 'components'),
	'utils': join(src, 'utils')
};

module.exports = config;