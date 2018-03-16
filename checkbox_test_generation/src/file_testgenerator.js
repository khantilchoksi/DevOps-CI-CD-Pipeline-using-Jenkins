// Core/NPM Modules
const product = require('iter-tools/lib/product');
const fs      = require("fs");
const mock    = require('mock-fs');
const _       = require('lodash');



// Mock file operations
const mockFileLibrary = {
    pathExists: {
        // 'path/fileExists': {  },
        // 'path/nonempty': { 'file': '' },
        emptyDir: 'mock.directory()',
        nonEmptyDir: 'mock.directory({ items: { file: mock.file() } })',
        file: 'mock.file()'
    },
    fileWithContent: {
        pathContent: {
            file1: "new Buffer('abc')",
            someDir: 'mock.directory()'
        }
    }
};


/**
 * Generate test cases based on the global object functionConstraints.
 *
 * @param {String} filepath            Path to write test file.
 * @param {Object} functionConstraints Constraints object as returned by `constraints`.
 */
function generateTestCases(filepath, functionConstraints) {

    // Content string. This will be built up to generate the full text of the test string.
    let content = `let subject = require('${filepath}')\nlet mock = require('mock-fs');\n`;

    // Iterate over each function in functionConstraints
    for ( let funcName in functionConstraints ) {

        // Reference all constraints for funcName.
        let params = functionConstraints[funcName].params;

        // Get constraints and map to values
        let constraints = functionConstraints[funcName].constraints;
        let values =  _.mapValues(constraints, (arr) => _.map(arr, c => c.value));

        // Generate possible combinations of arguments
        let argCombinations = product(..._.map(params, p => !_.isEmpty(values[p]) ? values[p] : ["''"]));

        // Handle global constraints...
        // Whether or not any constraint is of type fileWithContent of fileExists.
        let allConstraints = _.flattenDeep(_.map(constraints));
        let fileWithContent = _.some(allConstraints, { kind: 'fileWithContent' });
        let pathExists      = _.some(allConstraints, { kind: 'fileExists' });

        // Generate function argument strings from parameter objects.
        for (let combination of argCombinations) {

            // Get final argument string
            let args = combination.join(', ');

            // If some constraint is of type fileWithContent or pathExists
            // Generate all combinations of file system test cases.
            if( pathExists || fileWithContent ) {
                content += generateMockFsTestCases(true,  true,  funcName, args);
                content += generateMockFsTestCases(false, true,  funcName, args);
                content += generateMockFsTestCases(true,  false, funcName, args);
                content += generateMockFsTestCases(false, false, funcName, args);
            }
            // Otherwise, just generate the naive test of calling the function
            // with default arguments and alternative arguments.
            else {
                content += `try { ${ "subject.{0}({1});".format(funcName, args) } } catch (e) {} \n`;
            }

        }

    }

    // Write final content string to file test.js.
    fs.writeFileSync('test.js', content, "utf8");

}


/**
 * Generate test cases for constraints dealing with whether or not a file exists.
 *
 * @param   {Boolean} pathExists      Whether or not to mock the path existing.
 * @param   {Boolean} fileWithContent Whether or not to mock the file existing with content.
 * @param   {String}  funcName        Name of the function under test.
 * @param   {String}  args            Function argument string.
 * @returns {string}                  Full text of the generated file system test.
 */
function generateMockFsTestCases (pathExists, fileWithContent, funcName, args) {

    // Partial test data
    let testCase = "";
    let mergedFS = {};

    // Add mock data for path if pathExists is true.
    if( pathExists ) {
        for (let attrname in mockFileLibrary.pathExists) {
            mergedFS[attrname] = mockFileLibrary.pathExists[attrname];
        }
    }

    // Add mock data for content if fileWithContent is true.
    if( fileWithContent ) {
        for (let attrname in mockFileLibrary.fileWithContent) {
            mergedFS[attrname] = mockFileLibrary.fileWithContent[attrname];
        }
    }

    // Generate and return test case string.
    testCase += 'try{\n';
    testCase += `\tmock(${JSON.stringify(mergedFS).replace(/"/g, '')});\n`;
    testCase += `\t\tsubject.${funcName}(${args});\n`;
    testCase += "\tmock.restore();\n";
    testCase += '} catch(e) {}\n';
    return testCase;
}


// Export
module.exports = generateTestCases;