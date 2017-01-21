/**
 * When karma executes this file, it will look through our 
 * src/ directory for any files ending in .spec.js and execute 
 * them as tests. Here, we can set up any helpers or global configuration 
 * we'll use in all of our tests
 */
require('babel-polyfill');

/**
 * Since we're going to be using a helper called chai enzyme,
 * we can set our global configuration up here
 */
const chai = require('chai'),
	chaiEnzyme = require('chai-enzyme');

chai.use(chaiEnzyme());

let context = require.context('./src', true, /\.spec\.js$/);

context.keys().forEach(context);