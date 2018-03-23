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

----------------------------------------------------------------------------------

## Milestones

* ###[Milestone1](/milestone1.md)  


---------------------------------------------------------------------------

## Contribution 
   * *Automated test generation on Checkbox:*  Navjot & Khantil 
   * *Jenkins setup and Jacoco coverage:* Khelan & Pavithra
   * *iTrust Commit Fuzzer & Test prioritization:* Khelan & Khantil & Pavithra 
   * *Report generation:* Entire team
   
## Coverage/Jenkins Support

Ensure you have the ability to run iTrust's and checkbox.io* test suite. You need to have your build server have a jetty/mysql instance in order to properly run the unit + integration tests. Add a plugin to jenkins to measure coverage and display a report within Jenkins on every commit.

Link to screencast : https://www.youtube.com/watch?v=_wqYCOx5aO0&feature=youtu.be

## Automated Commit Generation - Commit Fuzzer

iTrust already has test suite which is run with Junit and JaCoCo code coverage plugin. The pre-push-hook runs fuzzer.js n times when we push to master. After commiting a fuzzed code, the fuzzer reverts back to original code so that the fuzzing operations are done on original code again.

Test case fuzzer is [here](./roles/fuzzer/templates/fuzzer.js) and we have made a new jenkins build job for this. The Jenkins job builder script for iTrust fuzzer is [here](./roles/create_jobs/templates/itrust_fuzzing.yml). We have also written a small ansible script [here](fuzzing.yml) that clones the iTrust repository and issues test commits that triggers our "itrust_fuzzer_job" job.

Link to Screencast for Fuzzing and Test Prioritization:  https://youtu.be/bdZcqy-U0aA

#### Some of our fuzzing operations: 

1. swap "<" with ">"
2. swap "==" with "!="
3. swap 0 with 1
4. swap "++" with "--"
5. swap "true" with "false"


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
4. Changin == to = in condition checks  
5. Using faker we can replace the String constants using randomly generated strings.

#### Reasons for highest ranked test cases

In testPasswordReset and testPasswordChangeForm (among the most failed test cases), the validate function on password tests that the new password is in the range 6-20. This is implemented as -
```
   if ( getNewPassword().length() < 6 || getNewPassword().length() > 20 ) {
      throw new IllegalArgumentException( "New password must be between 6 and 20 characters." );
   }
   return true;
```       
Observation:
1. With 60% chance, either the '<' is swapped with '>' and '>' is swapped with '<'. 
2. The function returns true in the end. With 60% chance, true is changed to false. 

Hence, the function will either throw an exception or will return false and our test case will fail.

## Describe your approach for automated test generation. How many tests were you able to achieve and what was the resulting coverage?

### Mocking
To mock access to MongoDB, we created a db handle (/mock_db/...) and test data files (/test_data/...) that contains sample data.  

### Modifying Routes
To incorporate mocking into the routes, we created a directory called 'mock_routes' with similar structure as 'routes'. It has the similar code structure as the original routes with MongoDB client and DB handle that reflects mocked database and test data. 

[]()

### Code traversal
To incorporate variations in GET request, we find if the url has a variable parameter (starting with ':'). Then based on the knowledge of the test data and the values present in the db, we select random values for those input parameters and create the respective test cases.

To handle variations in POST request, we traverse through the method code that deals with the POST request and find out the statements that indicates the parameters that the method searches for in the 'request body'. We then keep those parameters and find the binary assignment statments in the rest of the method to identify potential values for those parameters.

### Code Coverage and Test Cases:
The initial number of test cases for original 12 routes covered in 'server.js' are 42. The coverage for each of the three files is shown below. The number of test cases increase as we run the tests again and again and create sample data to handle variations in data present in the database.
[]()
[]()
[]()

---------------------------------  
## Execution / Implementation

0. Clone this repo and make sure you have your AWS Credentials and GithHub credentials as described in the next section.  

1. **[Provision Jenkins Server](./provision_ec2.yml)** Starting with the below following command lets you provision a Jenkins Server. It will create the inventory file and the keys folder with the private key required to ssh to the remote instance.    
     ``` ansible-playbook -i "localhost," -c local provision_ec2.yml  --extra-vars="param=jenkins" ```  

2. **[Configure Jenkins Server](./jenkins.yml)** Once we have the instance running on the remote server, we configure it using jenkins.yml script. This installs Jenkins Server along with all the dependencies, creates the user, and starts the Jenkins server. We can test it on our browser at the remote instances' URL and port 8080.    
     ``` ansible-playbook -i ~/inventory jenkins.yml ```

3. **[Create Jobs](./create_jobs.yml)**  Now we create the jobs. We create a template under the [create_jobs](./roles/create_jobs) role which has all the jobs that are to be created. At this point all iTrust_Fuzzer_Job is also created and will be notified on each commit of the master branch of iTrust_Fuzzer (forked repo).   
     ``` ansible-playbook -i ~/inventory create_jobs.yml ```

4. **[Create JACOCO Report by building iTrust job](./build_itrust.yml)** 
    * [Build iTrust2](./build_itrust.yml)   
     ``` ansible-playbook -i ~/inventory build_itrust.yml ```
    * This is the Jenkins Job Builder Script For iTrust JACOCO REPORT generation: (./roles/create_jobs/templates/itrust_jenkins_jobs.yml)

5. **[Fuzzing](./fuzzing.yml)**  Now we create the jobs. We create a template under the [create_jobs](./roles/fuzzer) role which has all the tasks that are to be created.    
     ``` ansible-playbook fuzzing.yml ```
     * This will basically clone the iTrust repo and add `pre-push` hook, make new branch fuzzer, make some changes on master branch and push the changes which will trigger the pre-push hook and run our [node js code for fuzzing](./roles/fuzzer/files/fuzzer.js), commiting and rollbacking on fuzzer branch.

6. **[Test Prioritization](./prioritization.yml)**  We have created ansoible-playbook which has role [prioritzation](./roles/prioritization)  which has all the tasks that are to be needed to analyze the test-reports generated from the fuzzing.    
     ``` ansible-playbook -i ~/inventory prioritization.yml ```
     * This will basically run our [prioritization js code](./roles/prioritization/templates/prioritization.js) on the xml test-reports generated after every build job.   

### Managing GitHub and AWS Credetials:  
* Loading AWS Credentials from the shared credentials file:  
     * Keep your AWS credentials data in a shared file used by SDKs and the command line interface. The SDK for JavaScript automatically searches the shared credentials file for credentials when loading. Where you keep the shared credentials file depends on your operating system:  
        ```config
        Linux, Unix, and macOS users:`~/.aws/credentials`  
        Windows users:`C:\Users\USER_NAME\.aws\credentials`   
        ```
        
        ```config
        [default]  
        aws_access_key_id = <YOUR_ACCESS_KEY_ID>  
        aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY> 
        ```
     
     * The [nodejs code](/roles/ec2_instance/templates/ec2_createinstance.js) is used to access this credetials and create new EC2 instance whenever required.  
        
* The github credentails are maintained by creating the SSH key pairs and registering the [public key on github account](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/). Moreover, the github password is also managed for cloning the iTrust repo in iTrust EC2 instance as `post-build` using [ansible vault](http://docs.ansible.com/ansible/2.4/vault.html).
## References  
   * https://wiki.jenkins.io/display/JENKINS/SCM+Sync+configuration+plugin
   * https://wiki.jenkins.io/display/JENKINS/Building+a+software+project
   * https://www.eclemma.org/jacoco/trunk/doc/maven.html
   * https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html    
   * https://medium.com/devops-process-and-tools/configure-jenkins-job-with-ansible-jenkins-plugin-to-setup-ci-for-ansible-playbooks-3ed23137d314  
   * https://wiki.jenkins.io/display/JENKINS/Post+build+task  
   * http://docs.ansible.com/ansible/2.4/vault.html 


