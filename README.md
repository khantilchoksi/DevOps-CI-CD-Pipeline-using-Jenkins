# DevOps-Project
DevOps Project Spring 2018 NC State University

#### Team members

1. Navjot Singh; nsingh9@ncsu.edu
2. Khelan Patel; kjpatel4@ncsu.edu
3. Khantil Choksi; khchoksi@ncsu.edu
4. Pavithra Iyer; piyer3@ncsu.edu

## Screencast: 
[  Click here to go the screencast video  ](https://youtu.be/uFHt1vF90pI)

## Working

1. **[Provision Jenkins Server](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/provision_ec2.yml)** Starting with the below following command lets you provision a Jenkins Server. It will create the inventory file and the keys folder with the private key required to ssh to the remote instance.    
     ``` ansible-playbook -i "localhost," -c local provision_ec2.yml  --extra-vars="param=jenkins" ```
2. **[Configure Jenkins Server](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/jenkins.yml)** Once we have the instance running on the remote server, we configure it using Jenkins.yml script. This installs Jenkins Server along with all the dependencies, creates the user, and starts the Jenkins server. We can test it on our browser at the remote instances' URL and port 8080.    
     ``` ansible-playbook -i inventory Jenkins.yml ```
3. **[Create Jobs](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/create_jobs.yml)**  Now we create the jobs. We create a template under the [create_jobs](https://github.ncsu.edu/khchoksi/DevOps-Project/tree/milestone1/roles/create_jobs) role which has all the jobs that are to be created.    
     ``` ansible-playbook -i inventory create_jobs.yml ```
4. **[Build Jobs](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/build_itrust.yml)**  After creating the jobs we build the jobs sequentially. This is to reduce the load on the remote instance.
          -[Build checkbox](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/build_checkboxio.yml)   
     ``` ansible-playbook -i inventory build_checkboxio.yml ```  
          -[Build iTrust2](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/build_itrust.yml)   
     ``` ansible-playbook -i inventory build_itrust.yml ```


## Challenges faced

### Jenkins (Khantil & Navjot)
- Figuring out the differences in using "java -jar" with Jenkins-cli.jar and "Jenkins-jobs" for updating, deleting jobs was tricky. Java -jar command didn't delete the jobs completely and that led to the problems with creating new jobs.
- After provisioning EC2 instances, we were initially immediately running ansible scripts to configure the machines. The delay in setting up the machines on the Amazon servers led to post-build failures as the servers would often refuse connections.
- The variations in users while switching between the host, Ansible, and Jenkin server was tricky as we were initially considering only Ubuntu and Vagrant user and overlooked the presence of Jenkins user.
- We initially setup the system using Vagrant and while installing Python, it used Python 2. However, on deploying on EC2 instances, it already has Python 3 version installed and mismatches between pip and pip3 software utility lists broke the system at various points. We tried pre-installing python 2 after using the python-interpreter command with ansible inventory but that failed because of conflicts. Finally, we used python 3's setuptools and easy install to move everything to Python 3.
- We tried using a synced folder on our local machine with Vagrant to test run the entire system to start with. This gave problems with the keys stored as virtual machine user was not able to properly restrict the permissions on the key.
- Building both the jobs simultaneously would hang up the EC2 instances even after increasing the memory. We then decided to ran them sequentially to distribute the load over time.

### Checkbox.io (Khelan - Pavithra)
- Figure out how to use vault to encrypt the DB passwords.
- Setting up MongoDB service and adding a user took us a lot of time.
- Since we were running playbook to deploy checkbox.io we later realized about setting up environment variables in a virtual machine.

### iTrust2 (Khelan - Pavithra) 
- Learnt how to set up MySQL-server without root password and make necessary changes in mysql.conf file to accept incoming connections.
- Learnt how to kill processes before deploying application again on EC2 instance (so that it doesn't give port binding error: Idempotency)
- Learnt how to bypass the prompts for password via ansible (for setting up MySql)
- We had to increase the memory of the node machine in order to completely run the tests and had to look out for few long-running java dispatcher jobs (forcefully kill them)


## Contribution 

Setting up Jenkins, writing build, post-build jobs using Jenkin job builder: Khantil & Navjot

Configuring & deploying checkbox.io, iTrust2: Khelan & Pavithra


### References
https://stackoverflow.com/questions/46515704/how-to-kill-a-running-process-using-ansible
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html
https://dba.stackexchange.com/questions/185240/creating-mongodb-database-with-ansible-playbook
https://medium.com/devops-process-and-tools/configure-jenkins-job-with-ansible-jenkins-plugin-to-setup-ci-for-ansible-playbooks-3ed23137d314
https://docs.openstack.org/infra/jenkins-job-builder/publishers.html
