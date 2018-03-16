//Core / NPM Modules
const _       = require('lodash');
const fs      = require("fs");


/**
 * Generate test cases based on the global object functionConstraints.
 *
 * @param {String} filepath            Path to write test file.
 * @param {Object} routeConstraints Constraints object as returned by `constraints`.
 */
function generateTestCases(filePath, routeConstraints){
    // Content string. This will be built up to generate the full text of the test string.
    let content = `let subject = require('${filepath}');`
    content += `\nvar request = require("request");`;
    content += `\nvar assert = require('assert');`;
    content += `\nvar sinon = require('sinon')`;
    content += `\nvar mongoose = require('mongoose')`;
    content += `\nrequire('sinon-mongoose');`;
    content += `\nvar nock = require("nock")`;

    for( let routePath in routeConstraints){
        content += `request( ${ "{0}".format(routePath) } , function(err, res) {} ); \n`;
    }
    

    // Write final content string to file test.js.
    fs.writeFileSync('test.js', content, "utf8");
}

