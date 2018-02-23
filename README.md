# DevOps-Project
DevOps Project Spring 2018 NC State University

#### Team members

1. Navjot Singh; nsingh9@ncsu.edu
2. Khelan Patel; kjpatel4@ncsu.edu
3. Khantil Choksi; khchoksi@ncsu.edu
4. Pavithra Iyer; piyer3@ncsu.edu

Link to screencast: 

## Contribution 

Setting up Jenkins and building jobs : Khantil & Navjot

Deploying checkbox.io & iTrust2 : Khelan & Pavithra

## Challanges faced

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

