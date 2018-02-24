# DevOps-Project
DevOps Project Spring 2018 NC State University

----------------------------------------  
### Team members
   Name             ::        Unity ID  
1. Navjot Singh     ::        nsingh9
2. Khelan Patel     ::        kjpatel4
3. Khantil Choksi   ::        khchoksi
4. Pavithra Iyer    ::        piyer3

--------------------------------------------------------

## Screencast
[  Click here to watch screencast video  ](https://youtu.be/uFHt1vF90pI)

---------------------------------------------------------------------------
## Implementation

1. **[Provision Jenkins Server](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/provision_ec2.yml)** Starting with the below following command lets you provision a Jenkins Server. It will create the inventory file and the keys folder with the private key required to ssh to the remote instance.    
     ``` ansible-playbook -i "localhost," -c local provision_ec2.yml  --extra-vars="param=jenkins" ```
2. **[Configure Jenkins Server](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/jenkins.yml)** Once we have the instance running on the remote server, we configure it using Jenkins.yml script. This installs Jenkins Server along with all the dependencies, creates the user, and starts the Jenkins server. We can test it on our browser at the remote instances' URL and port 8080.    
     ``` ansible-playbook -i inventory Jenkins.yml ```
3. **[Create Jobs](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/create_jobs.yml)**  Now we create the jobs. We create a template under the [create_jobs](https://github.ncsu.edu/khchoksi/DevOps-Project/tree/milestone1/roles/create_jobs) role which has all the jobs that are to be created.    
     ``` ansible-playbook -i inventory create_jobs.yml ```
4. **[Build Jobs](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/build_itrust.yml)**  After creating the jobs we build the jobs sequentially. This is to reduce the load on the remote instance.  
          * [Build checkbox](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/build_checkboxio.yml)   
     ``` ansible-playbook -i inventory build_checkboxio.yml ```  
          * [Build iTrust2](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/build_itrust.yml)   
     ``` ansible-playbook -i inventory build_itrust.yml ```
     
### Managing GitHub and AWS Credetials:  
* Loading AWS Credentials from the shared credentials file:  
        * Keep your AWS credentials data in a shared file used by SDKs and the command line interface. The SDK for JavaScript automatically searches the shared credentials file for credentials when loading. Where you keep the shared credentials file depends on your operating system:
        ```
         Linux, Unix, and macOS users: ~/.aws/credentials  
        Windows users: C:\Users\USER_NAME\.aws\credentials  
        [default]
        aws_access_key_id = <YOUR_ACCESS_KEY_ID>
        aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
        ```

        * The [nodejs code](/roles/ec2_instance/templates/ec2_createinstance.js) is used to access this credetials and create new EC2 instance whenever required.

* The github credentails are maintained by creating the SSH key pairs and registering the [public key on github account](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/). Moreover, the github password is also managed for cloning the iTrust repo in iTrust EC2 instance as `post-build` using [ansible vault](http://docs.ansible.com/ansible/2.4/vault.html).

-----------------------------------------  

## Experience and Challenges Faced

### Provisioning, Configuring Jenkins; Jenkins-Job-Builds (Khantil & Navjot)
     * The first major issue was to handle the setup wizard and simultaneously providing sercure configuration. To resolve this, the default admin user was created. By creating the `init.groovy.d` directory under the Jenkins default path `/var/lib/jenkins/`, and putting the `groovy` file, for creating a new account helped to solve this issue. [Resource](https://github.com/geerlingguy/ansible-role-jenkins/issues/50)
    * Next to the above challenge was, once the creation of user groovy file was placed inside the `init.groovy.d`, every time the jenkins server was restarted, it was making the new user everytime. So, we have to place the groovy file for creating the user, then restarting the jenkins server to take effect of that and then removing this file, solved our issue.  
    * After the new EC2 instance has been created, the first time when we `ssh` or run ansible script on that node, it asks for the host key to be added in known_hosts. So, it was hindering our process to automate the tasks. So, we turned off `ANSIBLE_HOST_KEY_CHECKING` feature by adding this into `ansible.config` file. 
    ```
    [defaults]   
    host_key_checking = False
    ```
     * Figuring out the differences in using "java -jar" with Jenkins-cli.jar and "Jenkins-jobs" for updating, deleting jobs was tricky. `java -jar` command didn't delete the jobs completely and that led to the problems with creating new jobs. 
     * After provisioning EC2 instances, we were initially immediately running ansible scripts to configure the machines. The delay in setting up the machines on the Amazon servers led to post-build failures as the servers would often refuse connections.  
     * The variations in users while switching between the host, Ansible, and Jenkin server was tricky as we were initially considering only Ubuntu and Vagrant user and overlooked the presence of Jenkins user.  
     * We initially setup the system using Vagrant and while installing Python, it used Python 2. However, on deploying on EC2 instances, it already has Python 3 version installed and mismatches between pip and pip3 software utility lists broke the system at various points. We tried pre-installing python 2 after using the python-interpreter command with ansible inventory but that failed because of conflicts. Finally, we used python 3's setuptools and easy install to move everything to Python 3.      * We tried using a synced folder on our local machine with Vagrant to test run the entire system to start with. This gave problems with the keys stored as virtual machine user was not able to properly restrict the permissions on the key.  
     * Building both the jobs simultaneously would hang up the EC2 instances even after increasing the memory. We then decided to ran them sequentially to distribute the load over time.

#### Checkbox.io: Provisioning & Configuring (Khelan & Pavithra)  
   * Figure out how to use vault to encrypt the DB passwords.  
   * Setting up MongoDB service and adding a user took us a lot of time.  
   * Since we were running playbook to deploy checkbox.io we later realized about setting up environment variables in a virtual machine.

#### iTrust2: Provisioning & Configuring (Khelan & Pavithra) 
   * Learnt how to set up MySQL-server without root password and make necessary changes in mysql.conf file to accept incoming connections.  
   * Learnt how to kill processes before deploying application again on EC2 instance (so that it doesn't give port binding error: Idempotency).  
   * Learnt how to bypass the prompts for password via ansible (for setting up MySql).
   * We had to increase the memory of the node machine in order to completely run the tests and had to look out for few long-running java dispatcher jobs (forcefully kill them). 

----------------------------------------------------------------------------------

## Contribution 
   * *Khantil & Navjot:* Provisioning and Configuring Jenkins Server automation; Writing job-builds, `post-build jobs` using Jenkins job builder.  
   * *Khelan & Pavithra:* Provisioning, Configuring & Deploying *checkbox.io*, *iTrust2*  

------------------------------------------------------------ 

## References  
   * https://github.com/geerlingguy/ansible-role-jenkins/issues/170  
   * https://github.com/geerlingguy/ansible-role-jenkins/issues/50  
   * https://stackoverflow.com/questions/46515704/how-to-kill-a-running-process-using-ansible  
   * https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html  
   * https://dba.stackexchange.com/questions/185240/creating-mongodb-database-with-ansible-playbook  
   * https://medium.com/devops-process-and-tools/configure-jenkins-job-with-ansible-jenkins-plugin-to-setup-ci-for-ansible-playbooks-3ed23137d314  
   * https://docs.openstack.org/infra/jenkins-job-builder/publishers.html  
   * http://docs.ansible.com/ansible/2.4/vault.html  

