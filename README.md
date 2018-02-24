# DevOps-Project
DevOps Project Spring 2018 NC State University

#### Team members

1. Navjot Singh; nsingh9@ncsu.edu
2. Khelan Patel; kjpatel4@ncsu.edu
3. Khantil Choksi; khchoksi@ncsu.edu
4. Pavithra Iyer; piyer3@ncsu.edu

#### Screencast: 
[Link to screencast: ](https://youtu.be/uFHt1vF90pI)

## Contribution 

Setting up Jenkins, writing build, post-build jobs using Jenkin job builder : Khantil & Navjot

Configuring & deploying checkbox.io, iTrust2 : Khelan & Pavithra

## Challanges faced

### Jenkins (Khantil & Navjot)
- Figuring out the differences in using "java -jar" with jenkins-cli.jar and "jenkins-jobs" for updating, deleting jobs was tricky. Java -jar command didn't delete the jobs completely and that led to the problems with creating new jobs.
- After provisioning EC2 instances, we were initially immediately running ansible scripts to configure the machines. The delay in setting up the machines on the Amazon servers led to post-build failures as the servers would often refuse connections.
- The variations in users while switching between host, ansible, and Jenkin server was tricky as we were initially considering only Ubuntu and Vagrant user and overlooked the presence of Jenkins user.
- We initially setup the system using Vagrant and while installing Python, it used Python 2. However, on deploying on EC2 instances, it already has Python 3 version installed and mismatches between pip and pip3 software utility lists broke the system at various points. We tried pre-installing python 2 after using python-interpretor command with ansible inventory but that failed because of conflicts. Finally, we used python 3's setuptools and easy install to move everything to Python 3.
- We tried using a synced folder on our local machine with Vagrant to test run the entire system to start with. This gave problems with the keys stored as virtual machine user was not able to properly restrict the permissions on the key.

### Checkbox.io (Khelan - Pavithra)
- Figure out how to use vault to encrypt the DB passwords.
- Setting up mongoDB service and adding a user took us a lot of time.
- Since we were running playbook to deploy checkbox.io we later realized about setting up environment variables in virtual machine.

### iTrust2 (Khelan - Pavithra) 
- Learnt how to set up mysql-server without root password and make necessary changes in mysql.conf file to accept incoming connections.
- Learnt how to kill processes before deploying application again on EC2 instance (so that it doesn't give port binding error : Idempotency)
- Learnt how to bypass the prompts for password via ansible (for setting up MySql)
- We had to increase the memory of the node machine in order to completely run the tests and had to look out for few long running java dispatcher jobs (forecefully kill them)

### References
https://stackoverflow.com/questions/46515704/how-to-kill-a-running-process-using-ansible
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html
https://dba.stackexchange.com/questions/185240/creating-mongodb-database-with-ansible-playbook
https://medium.com/devops-process-and-tools/configure-jenkins-job-with-ansible-jenkins-plugin-to-setup-ci-for-ansible-playbooks-3ed23137d314
https://docs.openstack.org/infra/jenkins-job-builder/publishers.html

