var fs = require('fs'),
    xml2js = require('xml2js'),
    child  = require('child_process'); 
var HashMap = require('hashmap');
var parser = new xml2js.Parser();
var Bluebird = require('bluebird');
const path = require('path');

var dirName = "test-reports";

//const fs = require('fs');
const dir = 'test_reports';
var total =1;
fs.readdir(dir, (err, files) => {
  console.log("total directories are");
  console.log(files.length);
  total = files.length;
});

//calculatePriority();
//findFlaky();
//readFiles(dirName);
var map = new HashMap();

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walkSync(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir, file));
    });
    return filelist;
}

let filePaths = walkSync('test_reports');
//console.log(filePaths);
readFiles(filePaths);

function readFiles(filePaths) {
   // fs.readdir(dirname, function(err, filenames) {
   //   if (err) {
   //       console.log(err);
        //onError(err);
   //     return;
    //  }
      filePaths.forEach(function(filename) {
//        console.log(filename); 
	 //console.log(`test_reports\${filename}`);
          if(filename.endsWith(".xml")){
	//	console.log(filename);
	  
          //var testReport = dirName+'/'+filename;
        //console.log(filename);  
	calculatePriority(filename);
	}
      });
    //});
	setTimeout(func, 15000);
}

function func(){
//map.forEach(function(value, key) {
//    var failed = (total-value[0]);
    //var passed = (total-value);
//    console.log("TestName: "+key + " passed:  " + value[0]+ "  failed: "+failed+ " AVG Time: "+(value[1]/failed));
    //Flakiness = no of failed tests / total tests
//});
var array= [];

map.forEach(function(value,key){
array.push({
	name: key,
	value: value
});
});

//for (var key in map){
  //  array.push({
   //     name: key,
  //      value: map[key]
  //  });
//}
//for (var i in array){
//	console.log("KEY:"+array[i].name+" PASSED:"+array[i].value);
//}
var sorted = array.sort(function(a,b){
    //console.log("value of a is"+(a.value)[0]+" value of b is "+b.value);
    if((a.value)[0] == (b.value)[0]){
        if((a.value)[1] > (b.value)[1])
            return 1;
        else
            return -1;
    }else if((a.value)[0] > (b.value)[0]){
        return 1;
    }else if((a.value)[0] < (b.value)[0]) {
        return -1;
    }
});

//console.log("SORTED:********************************************\n"+sorted);

let content = "\n ------------ PRIORITIZATION REPORT -------------- \n\n";

for (var x in sorted){
//console.log("inside loop"+(sorted[x].value)[0]);
var no_failed =total - ((sorted[x].value)[0]);
//console.log("value is"+no_failed);
var upper = ((sorted[x].value)[1]);
var avg_time = (no_failed==0)?0:(upper/no_failed);
console.log("Test name is: "+(sorted[x].name)+ " || # of times failed: "+(no_failed)+" || time is: "+(avg_time));
content+="Test name is: "+(sorted[x].name)+ " || # of times failed: "+(no_failed)+" || time is: "+(avg_time)+'\n';

}
fs.writeFileSync("Prioritization_Report.txt", content, "utf8");
}



//var map = new HashMap();
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
  //      console.log("\n FOUND PASS :::"+object[0] +" TIME ::: "+object[1] +"\t"+tests[x].name);
        
        if(tests[x].status == "passed"){
            passCount = passCount+1;
            
//            console.log("\n COUNTER: "+passCount);
            
        }else{
            //Test case failed
            totalTime = totalTime + tests[x].time;
        }
        
        map.set(tests[x].name, [passCount, totalTime]);

    
    }
}
  
 //   tests.sort(predicateBy());
 //   tests.forEach( e => console.log(e));
}




function readResults(result)
{
    var tests = [];
    for( var i = 0; i < result.testsuite['$'].tests; i++ )
    {
        var testcase = result.testsuite.testcase[i];
        
        tests.push({
        name:   testcase['$'].name, 
        time:   parseFloat(testcase['$'].time), 
        status: testcase.hasOwnProperty('failure') ? "failed": "passed"
        });
    }    
    return tests;
}

// function predicateBy(prop){
//     return function(a,b){
//        if( a[prop] > b[prop]){
//            return 1;
//        }else if( a[prop] < b[prop] ){
//            return -1;
//        }
//        return 0;
//     }
//  }

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

