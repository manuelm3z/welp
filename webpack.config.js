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

module.exports = config;