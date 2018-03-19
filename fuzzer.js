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
        if (!file.match(/model/) && !file.match(/sql/) && path.basename(file).match(/[a-zA-Z0-9._/]+[.]java$/g)) {
            javaPaths.push(file)
        }
    })
    // console.log(javaPaths);
    return javaPaths;
}

const fileFuzzer = (filePath) => {
    // reading the file line by line as an array
    let lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
    fs.writeFileSync(filePath, '', {encoding:'utf8'});

    lines.forEach(line=>{
        let rnd = Math.random();
        // Random.integer(0, 1)(engine)
        if(rnd>0.80 && !line.match(/<.+>/) && (line.match(/while/) || line.match(/if/)))
            line = line.replace('<', '>')
        else if(rnd<0.20 && !line.match(/<.+>/) && (line.match(/while/) || line.match(/if/)))
            line = line.replace('>', '<')

        rnd = Math.random()
        if(rnd > 0.80)
            line = line.replace('==', '!=')
        else
            line = line.replace('!=', '==')
        
        rnd = Math.random()
        if(rnd > 0.80 && !line.match(/@/) && !line.match(/\\/))
            line = line.replace(/"([^"]*)"/g, `"ThisIsANotSoRandomString"`)

        // Adding new line to the end of each line to keep the format
        if(line != '\r')
            line += '\n'

        fs.appendFileSync(filePath, line, {encoding:'utf8'});
    })
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
        let javaPaths = getJavaFilePaths('iTrust/src/main/edu/ncsu/csc/itrust');
        reverToFirstCommit(sha1)
        javaPaths.forEach(javaPath =>{
            let rnd = Math.random();
            if(rnd > 0.95)
                fileFuzzer(javaPath);
        })
        let lastSha1 = commitFuzzer(master_sha1, i);
        triggerJenkinsBuild(jenkinsIP, jenkinsToken, githubURL, lastSha1)
    }
}

runFuzzingProcess(3);