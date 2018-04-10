# DevOps-Project:Milestone 3 DEPLOYMENT
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

* [Milestone1](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/README.md)  
* [Milestone2](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone2/README.md)  


---------------------------------------------------------------------------

## Contribution 
   * *Deployment:*  Khantil 
   * *Infrastructure Upgrade:* Navjot
   * *Canary Release:* Pavithra 
   * *Rolling Updates:* Khelan

--------------------------------------------  
## Screencasts
* [Deployment]() 
* [Infrastructure Upgrade]() 
* [Canary Release]()
* [Rolling Updates]()

-------------------------------------------------  
## Project Environment Setup AND Managing GitHub & AWS Credetials:  
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
        
* The github credentails are maintained by creating the SSH key pairs and registering the [public key on github account](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).  
    * Put your private key of github enterprise ncsu into */home/vagrant/.ssh/git_rsa*.
    * Moreover, the github password is also managed for cloning the iTrust repo in iTrust EC2 instance as `post-build` using [ansible vault](http://docs.ansible.com/ansible/2.4/vault.html).  
    
 * In order to make AWS instance API call successful, you have to setup system clock automatically to Eastern Time Zone, so for that make sure to add following line in your ```Vagrantfile```.   
 ```config
 config.vm.provision :shell, :inline => "sudo rm /etc/localtime && sudo ln -s /usr/share/zoneinfo/America/New_York /etc/localtime", run: "always"  
 ```
------------------------------------------------- 
   
## DEPLOYMENT  

### Architecture Diagram: 
![img](/Architecture.png)  

### Implementation:
1. Clone this repo and make sure you have your AWS Credentials and GithHub credentials as described in the next section.  

2. **[Provision Jenkins Server](./provision_ec2.yml)** Starting with the below following command lets you provision a Jenkins Server. It will create the inventory file and the keys folder with the private key required to ssh to the remote instance.    
     ```ansible-playbook -i "localhost," -c local provision_ec2.yml  --extra-vars="param=jenkins" ```  

3. **[Configure Jenkins Server](./jenkins.yml)** Once we have the instance running on the remote server, we configure it using jenkins.yml script. This installs Jenkins Server along with all the dependencies, creates the user, and starts the Jenkins server. We can test it on our browser at the remote instances' URL and port 8090.    
     ```ansible-playbook -i ~/inventory jenkins.yml ```

4. **[Create Jobs](./create_jobs.yml)**  Now we create the jobs. We create a template under the [create_jobs](./roles/create_jobs) role which has all the jobs that are to be created. At this point all iTrust_Fuzzer_Job is also created and will be notified on each commit of the master branch of iTrust_Fuzzer (forked repo).   
     ```ansible-playbook -i ~/inventory create_jobs.yml --vault-password-file ~/.vault_pass.txt ```  
     
### Tasks Performed:   
* Here, first EC2 (t2.medium) instance is created for Jenkins and required Jenkins plugins as well as ansible scripts, roles are being copied from repo to Jenkins server.  
* Now, when ```create_jobs.yml``` ansible playbook is run, it first adds github-webhook to Checkbox.io repo and iTrust2-v2 repo. Then, checks if EC2 instance for both the applications are already exists or not and if not, it will create Ec2 (t2.micro) instances. Then, creates job for jenkins with GIT SCM and Triggers and as part of post build script, it will deploy the application.
* Now, whenever there is commit to this remote repo, it will trigger respective jenkins job and deploy on the currently running EC2 instances.

---------------------------------------------------------

-------------------------------------------------------------
   
## INFRASTRUCTURE UPGRADE


---------------------------------------------------------

---------------------------------------------------------
   
## CANARY RELEASE


---------------------------------------------------------  
---------------------------------------------------------
   
## ROLLING UPDATES


---------------------------------------------------------

---------------------------------  

## References  
   * https://stackoverflow.com/questions/33939834/how-to-correct-system-clock-in-vagrant-automatically


