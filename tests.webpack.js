/**
 * When karma executes this file, it will look through our 
 * src/ directory for any files ending in .spec.js and execute 
 * them as tests. Here, we can set up any helpers or global configuration 
 * we'll use in all of our tests
 */
require('babel-polyfill');

let context = require.context('./src', true, /\.spec\.js$/);

context.keys().forEach(context);