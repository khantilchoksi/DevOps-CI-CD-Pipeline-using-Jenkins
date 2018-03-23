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

Link to screencast : https://www.youtube.com/watch?v=_wqYCOx5aO0&feature=youtu.be

## Automated Commit Generation - Commit Fuzzer

iTrust already has test suite which is run with Junit and JaCoCo code coverage plugin. The pre-push-hook runs fuzzer.js n times when we push to master. After commiting a fuzzed code, the fuzzer reverts back to original code so that the fuzzing operations are done on original code again.

Test case fuzzer is [here](Fuzzer/fuzzer.js) and we have made a new jenkins build job for this. The Jenkins job builder script for iTrust fuzzer is [here](roles/create_jobs/templates/itrust_fuzzing.yml). We have also written a small ansible script [here](fuzzing.yml) that clones the iTrust repository and issues test commits that triggers our "itrust_fuzzer_job" job.

#### Some of our fuzzing operations: 

1. swap "<" with ">"
2. swap "==" with "!="
3. swap 0 with 1
4. swap "++" with "--"
5. swap "true" with "false"

#### Fuzzing Analysis

#### Test Prioritization analysis
To generate the prioritization report, we are first sorting test cases on the basis of number of times failed in descending order. If the number of times failed are equal, then we sort on the basis of execution time in ascending order as seen in the report below - 
```
------------ PRIORITIZATION REPORT -------------- 

Test name is: testPasswordReset || # of times failed: 4 || time is: 0.5427500000000001
Test name is: testPersonnelForm || # of times failed: 3 || time is: 0.049666666666666665
Test name is: testPasswordChangeForm || # of times failed: 3 || time is: 0.17133333333333334
Test name is: testPatientDateOfDeath || # of times failed: 2 || time is: 0.045
Test name is: testGetNonExistentHospital || # of times failed: 0 || time is: 0
Test name is: testPatientAsPatient || # of times failed: 0 || time is: 0
Test name is: testPatientUnauthenticated || # of times failed: 0 || time is: 0
Test name is: testDiagnoses || # of times failed: 0 || time is: 0
Test name is: testPersonnelAPI || # of times failed: 0 || time is: 0
Test name is: testPatientAPI || # of times failed: 0 || time is: 0
Test name is: testUserAPI || # of times failed: 0 || time is: 0
Test name is: testGetNonExistentUser || # of times failed: 0 || time is: 0
Test name is: testCreateDomainObject || # of times failed: 0 || time is: 0
Test name is: testRetrieveDomainObject || # of times failed: 0 || time is: 0
Test name is: testDelete || # of times failed: 0 || time is: 0
Test name is: testGetNonExistentPatient || # of times failed: 0 || time is: 0
Test name is: testEmail || # of times failed: 0 || time is: 0
Test name is: testValidPasswordChanges || # of times failed: 0 || time is: 0
Test name is: testSendEmail || # of times failed: 0 || time is: 0
Test name is: testInvalidPasswordChanges || # of times failed: 0 || time is: 0
Test name is: testHospitalForm || # of times failed: 0 || time is: 0
Test name is: testRequestReset || # of times failed: 0 || time is: 0
Test name is: testCodes || # of times failed: 0 || time is: 0
Test name is: testPreScheduledOfficeVisit || # of times failed: 0 || time is: 0
Test name is: testInvalidCodes || # of times failed: 0 || time is: 0
Test name is: testOfficeVisitAPI || # of times failed: 0 || time is: 0
Test name is: testUserLockouts || # of times failed: 0 || time is: 0
Test name is: testGetNonExistentOfficeVisit || # of times failed: 0 || time is: 0
Test name is: testIPLockouts || # of times failed: 0 || time is: 0
Test name is: testDeleteNonExistentOfficeVisit || # of times failed: 0 || time is: 0
Test name is: testLogging || # of times failed: 0 || time is: 0
Test name is: testLogByDate || # of times failed: 0 || time is: 0
Test name is: testOfficeVisit || # of times failed: 0 || time is: 0
Test name is: testLogByDateLarge || # of times failed: 0 || time is: 0
Test name is: testEnumAPI || # of times failed: 0 || time is: 0
Test name is: testCodeAPI || # of times failed: 0 || time is: 0
Test name is: testDrugAPI || # of times failed: 0 || time is: 0
Test name is: testHospitalAPI || # of times failed: 0 || time is: 0
Test name is: testGetNonExistentAppointment || # of times failed: 0 || time is: 0
Test name is: testPrescriptionAPI || # of times failed: 0 || time is: 0
Test name is: testFieldValidation || # of times failed: 0 || time is: 0
Test name is: testDeleteNonExistentAppointment || # of times failed: 0 || time is: 0
Test name is: testCreateBadAppointmentRequest || # of times failed: 0 || time is: 0
Test name is: testAppointmentRequestAPI || # of times failed: 0 || time is: 0
Test name is: testEqualsAndProperties || # of times failed: 0 || time is: 0
Test name is: testGetNonExistentPersonnel || # of times failed: 0 || time is: 0
```
#### Types of problems that fuzzer discovered

#### Extension of fuzzing operations

We can extend the fuzzing operations in the following ways:
1. Swap && and ||
2. Swap << with >>
3. Remove the NOT operator(!)
4. 

#### Why do you think those tests were ranked the highest?


Describe your approach for automated test generation. How many tests were you able to achieve and what was the resulting coverage?

