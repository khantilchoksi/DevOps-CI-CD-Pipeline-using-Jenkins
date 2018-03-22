# DevOps-Project:Milestone 2 (Test and Analysis)
DevOps Project Spring 2018 NC State University

----------------------------------------   
## Team Members
|Name | Unity ID |
| :---: | :---: |
|1. Navjot Singh |       nsingh9|
|2. Khelan Patel     |        kjpatel4|
|3. Khantil Choksi|        khchoksi|
|4. Pavithra Iyer    |       piyer3|

## Coverage/Jenkins Support

Ensure you have the ability to run iTrust's and checkbox.io* test suite. You need to have your build server have a jetty/mysql instance in order to properly run the unit + integration tests. Add a plugin to jenkins to measure coverage and display a report within Jenkins on every commit.

Link to screencast : https://www.youtube.com/edit?o=U&video_id=_wqYCOx5aO0

## Automated Commit Generation - Commit Fuzzer

iTrust already has test suite which is run with Junit and JaCoCo code coverage plugin. The pre-push-hook runs fuzzer.js n times when we push to master. After commiting a fuzzed code, the fuzzer reverts back to original code so that the fuzzing operations are done on original code again.

Test case fuzzer is [here](Fuzzer/fuzzer.js) and we have made a new jenkins build job for this. The Jenkins job builder script for iTrust fuzzer is [here](roles/create_jobs/templates/itrust_fuzzing.yml). We have also written a small ansible script [here](fuzzing.yml) that clones the iTrust repository and issues test commits that triggers our "itrust_fuzzer_job" job.

#### Some of our fuzzing operations: 

1. swap "<" with ">"
2. swap "==" with "!="
3. swap 0 with 1
4. swap "++" with "--"
5. swap "true" with "false"
