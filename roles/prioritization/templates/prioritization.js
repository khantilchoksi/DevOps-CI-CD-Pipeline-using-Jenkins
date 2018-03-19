var fs = require('fs'),
xml2js = require('xml2js'),
child  = require('child_process');
var HashMap = require('hashmap');
var parser = new xml2js.Parser();
var Bluebird = require('bluebird')


var dirName = "test-reports";
var total = 1;

//calculatePriority();
//findFlaky();
readFiles(dirName);
var map = new HashMap();


var countDir = 0;
const walkSync = (dir, count) => {
    fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? count++
            : filelist.concat(path.join(dir, file));
    });
    return filelist;
}

function readFiles(dirname) {
fs.readdir(dirname, function(err, filenames) {
  if (err) {
      console.log(err);
    //onError(err);
    return;
  }
  filenames.forEach(function(filename) {
//        console.log(filename); 
     //console.log(`test_reports\${filename}`);
      if(filename.endsWith(".xml")){
    //      console.log(filename);

      var testReport = dirName+'/'+filename;
    console.log(filename);
    calculatePriority(testReport);
    }
  });
});
    setTimeout(func, 15000);
}

function func(){
map.forEach(function(value, key) {
    var failed = (total-value[0]);
    //var passed = (total-value);
    console.log("TestName: "+key + " passed:  " + value[0]+ "  failed: "+failed+ " AVG Time: "+(value[1]/failed));
    var array= [];
    
    //map.forEach(function(value))
    
    for (var key in map){
        array.push({
            name: key,
            value: map[key]
        });
    }
    
    var sorted = array.sort(function(a,b){
        if(a.value[0] == b.value[0]){
            if(a.value[1] > b.value[1])
                return 1;
            else
                return -1;
        }else if(a.value[0] > b.value[0]){
            return 1;
        }else if(a.value[0] < b.value[0]) {
            return -1;
        }
    });
    
    console.log("SORTED: "+sorted);
    
    
    for (var x in sorted){
        console.log("KEY: "+x[0]+" PASSED: "+x[1][0]+" TIME: "+x[1][1]);
    }
    //Flakiness = no of failed tests / total tests
});
}


async function calculatePriority(filePath)
{

var contents = fs.readFileSync(filePath)
let xml2json = await Bluebird.fromCallback(cb => parser.parseString(contents, cb));
var tests = readResults(xml2json);


for(var x = 0; x<tests.length; x++){
    if(!map.has(tests[x].name)){
        if(tests[x].status == "passed"){
            map.set(tests[x].name,  [1, 0]);
        }
            //map.set(tests[x].name, 1);
        else
        map.set(tests[x].name,  [0, tests[x].time]);
            //map.set(tests[x].name, 0);
    }else{
        var object = map.get(tests[x].name);
        var passCount = object[0];
        var totalTime = object[1];
        //console.log("\n FOUND PASS :::"+object[0] +" TIME ::: "+object[1] +"\t"+tests[x].name);
        
        if(tests[x].status == "passed"){
            passCount = passCount+1;
            
            console.log("\n COUNTER: "+passCount);
            
        }else{
            //Test case failed
            totalTime = totalTime + tests[x].time;
        }
        
        map.set(tests[x].name, [passCount, totalTime]);

    
    }
}

//tests.sort(predicateBy());
//tests.forEach( e => console.log(e));
}




function readResults(result)
{   
var tests = []; 
for( var i = 0; i < result.testsuite['$'].tests; i++ )
{
    var testcase = result.testsuite.testcase[i];

    tests.push({
    name:   testcase['$'].name,
    time:   testcase['$'].time,
    status: testcase.hasOwnProperty('failure') ? "failed": "passed"
    });
}
return tests;
}

function predicateBy(){
return function(a,b){
    var status = 'status';
    var time = 'time';
    if(a[status] == b[status]){
        if(a[time] > b[time]){
            return 1;
        }else{
            return -1;
        }
    }else if( a[status] > b[status]){
       return 1;
   }else if( a[status] < b[status] ){
       return -1;
   }
   return 0;
}
}

