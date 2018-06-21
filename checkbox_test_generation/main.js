/**
 * NodeJS Test Generation Module
 */


// Core/NPM Modules
const path    = require('path');


// Local Modules
const constraints       = require('./src/constraint');
var testgenerator = require('./src/testgenerator');
const generateTestCases = testgenerator.generateTestCases;


// Polyfills
require('./src/format-polyfill');



/**
 * Parse an input file and generate test cases for it.
 */
(module.exports.main = function() {
    let testFilePath = [];

    // Parse file input, defaulting to subject.js if not provided
    let args = process.argv.slice(2);
    if( args.length === 0 ) {
        args = ["server.js", "mock_routes/admin.js", "mock_routes/study.js", "mock_routes/create.js"];
    }
    //let filePath = path.resolve(args[0]);

    for(var i = 0; i < args.length; i++){
        testFilePath.push(path.resolve(args[i]));
    }

    // Initialize constraints based on input file
    let functionConstraints = constraints(testFilePath[0]);

    // Generate test cases
    generateTestCases(testFilePath, functionConstraints);

})();