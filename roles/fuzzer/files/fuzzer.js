const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
var http = require('http');



// Sync get list of files in a directory, recursively. 
// https://gist.github.com/kethinov/6658166#gistcomment-1941504
const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walkSync(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir, file));
    });
    return filelist;
}



const getJavaFilePaths = (dirPath)=>{
    let filePaths = walkSync(dirPath)
    let javaPaths = []

    filePaths.forEach(file => {
        if (!file.match(/models/) && !file.match(/sql/) && path.basename(file).match(/[a-zA-Z0-9._/]+[.]java$/g)) {
            javaPaths.push(file)
        }
    })
    console.log("\n ------------- JAVA PATHS: ",javaPaths);
    return javaPaths;
}

const fileFuzzer = (filePath) => {
    // reading the file line by line as an array
    let lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
    fs.writeFileSync(filePath, '', {encoding:'utf8'});

    var prob=0;
        lines.forEach(function(line){
            prob=Math.random();
            if(prob>0.5)
            {
              /*if(line.match('strings'))
              {
                
              }*/
            }

            prob=Math.random();
            if(prob>0.4)
            {
              if(line.match('for'))
              {
                if(line.match(/\+\+/)){
                  line=line.replace(/\+\+/g, "--");
                }
                else if(line.match("--")){
                  line=line.replace("--", "++");
                }
              }
            }

            prob=Math.random();
            if(prob>0.4)
            {
                if(line.match('true')){
                  line=line.replace('true', 'false');
                }
            }
            else{
                if(line.match('false')){
                  line=line.replace('false', 'true');
                }
            }
            
            prob=Math.random();
            if(prob>0.4)
            {
              if(line.match('while') || line.match('for') || line.match('if'))
              {
                
                if(line.match('<')){
                  line=line.replace('<', '>');
                }
                else if(line.match('>') && !line.match('->')){
                  line=line.replace('>', '<');
                }
    
              }
            }
            prob=Math.random();
            if(prob>0.4){
              if(line.match('=='))
                line=line.replace(/==/g,'!=');
              else if(line.match('!='))
                line=line.replace(/!=/g,'==');
              
            }
            prob=Math.random();
            
            if(prob>0.4)
            {
              if((line.match('while') || line.match('for') || line.match('if')) && line.match(/[0]/))
              {
                line=line.replace(/[0]/g,"1");
              }
              else if((line.match('while') || line.match('for') || line.match('if')) && line.match('1'))
              { 
                  line=line.replace(/[1]/g,'0');
              }

            }

            if(line != '\r')
              line += '\n'

            fs.appendFileSync(filePath,line);
    
        });
}

const commitFuzzer = (master_sha1, n) => {
    // child_process.execSync(`git add . && git commit -am "Fuzzing master:${master_sha1}: # ${n}" && git push --force`)
    child_process.execSync(`git stash && git checkout fuzzer && git checkout stash -- . && git commit -am "Fuzzing master:${master_sha1}: # ${n}" && git push`)
    child_process.execSync('git stash drop');
    let lastSha1 = child_process.execSync(`git rev-parse fuzzer`).toString().trim()
    return lastSha1;
}

const reverToFirstCommit = (firstSha1, n) => {
    // child_process.execSync(`git checkout fuzzer && git revert ${firstSha1}  -n -X theirs`)
    // child_process.execSync(`git checkout fuzzer && git revert fuzzer~${n-1}  -n -X theirs && git commit -m "revert"`)  
    child_process.execSync(`git checkout ${firstSha1}`)
}

const triggerJenkinsBuild = (jenkinsIP, jenkinsToken, githubURL, sha1) => {
    try {
	console.log("\n $$$$$$$$$$$ SHA1: ",sha1);
        console.log("http://${jenkinsIP}:8090/git/notifyCommit?url=${githubURL}&branches=fuzzer&sha1=${sha1}")
        child_process.execSync(`curl "http://${jenkinsIP}:8090/git/notifyCommit?url=${githubURL}&branches=fuzzer&sha1=${sha1}"`)
        console.log(`Succesfully trigger build for fuzzer:${sha1}`)
    } catch (error) {
        console.log(`Couldn't trigger build for fuzzer:${sha1}`)
    }
}


const runFuzzingProcess = (n) => {
    let master_sha1 = process.env.MASTER_SHA1;
    let sha1 = process.env.SHA1;
    let jenkinsIP = process.env.JENKINS_IP;
    let jenkinsToken = process.env.JENKINS_BUILD_TOKEN;
    let githubURL = process.env.GITHUB_URL;
    for (var i = 0; i < n; i++) {
        let javaPaths = getJavaFilePaths('iTrust2/src/main/java/edu/ncsu/csc/itrust2');
        reverToFirstCommit(sha1)
        javaPaths.forEach(javaPath =>{
            let rnd = Math.random();
            if(rnd > 0.35)
                fileFuzzer(javaPath);
        })
        let lastSha1 = commitFuzzer(master_sha1, i);
        triggerJenkinsBuild(jenkinsIP, jenkinsToken, githubURL, lastSha1)
    }
}

runFuzzingProcess(1);
