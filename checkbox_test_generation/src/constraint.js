// Core/NPM Modules
const esprima = require("esprima");
const faker   = require("faker");
const fs      = require('fs');
const Random  = require('random-js');
const _       = require('lodash');
const randexp = require('randexp');
const path    = require('path'); 
const study_data = require('../test_data/studies.json');
const vote_data = require('../test_data/votes.json');

class Constraint {
    constructor(properties){
        this.routePath = properties.routePath;
        this.kind = properties.kind;
        this.body = properties.body;
/*        this.expression = properties.expression;
        this.operator = properties.operator;
        this.value = properties.value;
        this.altvalue = properties.altvalue;
        this.funcName = properties.funcName;
        this.kind = properties.kind;
*/    }
}
const options = { tokens: true, tolerant: true, loc: true, range: true };

/**
 * Generate function parameter constraints for an input file
 * and save them to the global functionConstraints object.
 *
 * @param   {String} filePath Path of the file to generate tests for.
 * @returns {Object}          Function constraints object.
 */
function constraints(filePath) {

   // Initialize function constraints directory
    let routeConstraints = [];
    //let url = "http://54.202.103.166";

    // Read input file and parse it with esprima.
    let buf = fs.readFileSync(filePath, "utf8");
    let result = esprima.parse(buf, options);

    // Start traversing the root node
    traverse(result, function (node) {

        // If some node is a function declaration, parse it for potential constraints.
        if (node.type === 'ExpressionStatement') {

            // Traverse function node.
            traverse(node, function(child) {

                //Handle all get and post calls
                if( child.type === "CallExpression" && child.callee.property && (child.callee.property.name === "get" || child.callee.property.name === "post")) {
                    if(child.callee.property.name === 'get'){
                        // Get expression from original source code:
                        let expression = buf.substring(child.range[0], child.range[1]);
                        let url = (child.arguments[0].value);
                        //let full_url = url + expression;
                        let start_point = url.indexOf(":")
                        let end_point = url.indexOf("/", start_point);
                        if(start_point != -1){
                            if(end_point == -1){
                                end_point = url.length;
                                let sub = url.substring(start_point, end_point);
                                url = url.replace(sub, Math.floor(Math.random() * 4)+1 );
                            }
                            else{
                                let sub = url.substring(start_point, end_point);
                                url = url.replace(sub, 1);
                            }

                        }

                                // Push a new constraint
                                routeConstraints.push(new Constraint({
                                    routePath: url,
                                    kind: `${child.callee.property.name}`,
                                    body: ''
                                }));
                    }
                    else{
                        if(child.arguments[1] && child.arguments[1].type === 'FunctionExpression'){
                            let function_body = child.arguments[1].body.body;
                            for(var i = 0; i < function_body.length; i++){
                                if(function_body[i].type === 'VariableDeclaration'){
                                    if(function_body[i].declarations[0].init.type === 'CallExpression' && function_body[i].declarations[0].init.callee.object.name === 'marqdown'){
                                        let inner_node = function_body[i].declarations[0].init;
                                        if(inner_node.arguments[0].object.property.name === 'body'){
                                            let body_variable_name = inner_node.arguments[0].property.name;
                                            // Get expression from original source code:
                                            let url = (child.arguments[0].value);
                                            let reqBody = {};
                                            reqBody[body_variable_name] = "\n{NumberQuestions:true}\n-------";
                                            //let full_url = url + expression;
                                            // Push a new constraint
                                            routeConstraints.push(new Constraint({
                                                routePath: url,
                                                kind: `${child.callee.property.name}`,
                                                body: JSON.stringify(reqBody) 
                                            }));
                                        }
                                    }
                                }
                            }
                        }
                        else{
                            if(child.arguments[1] && child.arguments[1].type === "MemberExpression"){
                                // Get expression from original source code:
                                let url = (child.arguments[0].value);

                                let file = child.arguments[1].object.name;
                                let methodName = child.arguments[1].property.name;
                                file = path.resolve("mock_routes/" + file + ".js");
                                console.log("file is ");
                                console.log(file);
                                let body = findBody(file, methodName);
                                for(var each_key in body){
                                    if(body[each_key].length == 0)
                                        body[each_key] = findValueInDB(each_key);
                                }
                                var final_body = {};
                                let temp_keys = Object.keys(body);
                                let temp_values = Object.values(body);
                                var cross_product = cartesianProduct(temp_values);

                                console.log(cross_product);
                                for(var i in cross_product){
                                    for(var j in temp_keys){
                                        final_body[temp_keys[j]] = cross_product[i][j];
                                    }
                                    routeConstraints.push(new Constraint({
                                        routePath: url,
                                        kind: `${child.callee.property.name}`,
                                        body: `${JSON.stringify(final_body)}`
                                    }));
                                    console.log(final_body);
                                }




                                //let full_url = url + expression;

                            }
                        }
                    }
                }
            });
            // console.log( functionConstraints[funcName]);

        }
    });

    return routeConstraints;
}

function cartesianProduct(arr)
{
    return arr.reduce(function(a,b){
        return a.map(function(x){
            return b.map(function(y){
                return x.concat(y);
            })
        }).reduce(function(a,b){ return a.concat(b) },[])
    }, [[]])
}


function findValueInDB(key){
    var study_keys = Object.keys(study_data[0]);
    console.log(study_keys);
    var vote_keys = Object.keys(vote_data[0]);
    console.log(vote_keys);
    var result = [];
    console.log('-----------------');
    console.log(key);
    console.log(key.length);
    console.log(study_keys.includes(key));
    if(study_keys.includes(key)){
        for(var m_i in study_data){
            if(study_data[m_i][key] != null){
                console.log(study_data[m_i])
                console.log(study_data[m_i][key])            
                if(result.includes(study_data[m_i][key]))
                    continue;
                else
                    result.push(study_data[m_i][key]);
                console.log(result);                
            }
        }
        return result;
    }
    else{
        for(var m_i in vote_data){
            if(vote_data[m_i][key] != null){
                if(result.includes(vote_data[m_i][key]))
                    continue;
                else
                    result.push(vote_data[m_i][key]);
                console.log(result);                
            }
        }
        return result;
    }
}



function findBody(filePath, methodName) {
   // Initialize function constraints directory
    let body = {};
    // Read input file and parse it with esprima.
    let buf = fs.readFileSync(filePath, "utf8");
    let result = esprima.parse(buf, options);

    // Start traversing the root node
    traverse(result, function (node) {

        // If some node is a function declaration, parse it for potential constraints.
        if (node.type === 'Program'){
            traverse(node, function(child) {

                //Handle all get and post calls
                //console.log(child);
                if( child.type === "ExpressionStatement" && child.expression.type === 'AssignmentExpression' && child.expression.left.type === 'MemberExpression' && child.expression.left.property.name === methodName){
                    console.log("aa gya bai andar method de-------------------------");
                    console.log(methodName);
                    console.log(filePath);
                    traverse(child, function(inner_node){
                        if(inner_node.type == 'VariableDeclarator' && inner_node.init.type == 'MemberExpression' && inner_node.init.object.property && inner_node.init.object.property.name === 'body'){
                            body[inner_node.init.property.name] = [];
                            console.log("body dekho-----------------------");
                            console.log(JSON.stringify(body));
                        }
                        if(inner_node.type == 'IfStatement' && inner_node.test.type === 'BinaryExpression' && inner_node.test.left.name in body){
                            body[inner_node.test.left.name].push(inner_node.test.right.value);
                        }
                    });
                }
            });
        }
    });


/*
            // Traverse function node.
            traverse(node, function(child) {

                //Handle all get and post calls
                if( child.type === "CallExpression" && child.callee.property && (child.callee.property.name === "get" || child.callee.property.name === "post")) {
                    if(child.callee.property.name === 'get'){
                        // Get expression from original source code:
                        let expression = buf.substring(child.range[0], child.range[1]);
                        let url = (child.arguments[0].value);
                        //let full_url = url + expression;
                        let start_point = url.indexOf(":")
                        let end_point = url.indexOf("/", start_point);
                        if(start_point != -1){
                            if(end_point == -1){
                                end_point = url.length;
                                let sub = url.substring(start_point, end_point);
                                url = url.replace(sub, Math.floor(Math.random() * 4)+1 );
                            }

                        }

                                // Push a new constraint
                                routeConstraints.push(new Constraint({
                                    routePath: url,
                                    kind: `${child.callee.property.name}`,
                                    body: ''
                                }));
                    }
                }


            });
*/            // console.log( functionConstraints[funcName]);


    return body;
}




/**
 * Traverse an object tree, calling the visitor at each
 * visited node.
 *
 * @param {Object}   object  Esprima node object.
 * @param {Function} visitor Visitor called at each node.
 */
function traverse(object, visitor) {

    // Call the visitor on the object
    visitor(object);

    // Traverse all children of object
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}


/**
 * Return the name of a function node.
 */
function functionName(node) {
    return node.id ? node.id.name : '';
}


/**
 * Generates an integer value based on some constraint.
 *
 * @param   {Number}  constraintValue Constraint integer.
 * @param   {Boolean} greaterThan     Whether or not the concrete integer is greater than the constraint.
 * @returns {Number}                  Integer satisfying constraints.
 */
function createConcreteIntegerValue(constraintValue, greaterThan) {
    if( greaterThan ) return Random.integer(constraintValue + 1, constraintValue + 10)(engine);
    else return Random.integer(constraintValue - 10, constraintValue - 1)(engine);
}




// Export
module.exports = constraints;