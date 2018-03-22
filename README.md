# DevOps-Project
DevOps Project Spring 2018 NC State University

----------------------------------------   
## Team Members
|Name | Unity ID |
| :---: | :---: |
|1. Navjot Singh |       nsingh9|
|2. Khelan Patel     |        kjpatel4|
|3. Khantil Choksi|        khchoksi|
|4. Pavithra Iyer    |       piyer3|

----------------------------------------
## Milestones

* ###[Milestone1](/milestone1.md)  

* ###[Milestone2](/milestone2.md)

---------------------------------------------------------------------------
## Implementation

1. **[Provision Jenkins Server](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/provision_ec2.yml)** Starting with the below following command lets you provision a Jenkins Server. It will create the inventory file and the keys folder with the private key required to ssh to the remote instance.    
     ``` ansible-playbook -i "localhost," -c local provision_ec2.yml  --extra-vars="param=jenkins" ```
2. **[Configure Jenkins Server](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/jenkins.yml)** Once we have the instance running on the remote server, we configure it using Jenkins.yml script. This installs Jenkins Server along with all the dependencies, creates the user, and starts the Jenkins server. We can test it on our browser at the remote instances' URL and port 8080.    
     ``` ansible-playbook -i ~/inventory jenkins.yml ```
3. **[Create Jobs](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/create_jobs.yml)**  Now we create the jobs. We create a template under the [create_jobs](https://github.ncsu.edu/khchoksi/DevOps-Project/tree/milestone1/roles/create_jobs) role which has all the jobs that are to be created.    
     ``` ansible-playbook -i ~/inventory create_jobs.yml ```
4. **[Build Jobs](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/build_itrust.yml)**  After creating the jobs we build the jobs sequentially. This is to reduce the load on the remote instance.  
   * [Build checkbox](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/build_checkboxio.yml)   
     ``` ansible-playbook -i ~/inventory build_checkboxio.yml ```  
    * [Build iTrust2](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone1/build_itrust.yml)   
     ``` ansible-playbook -i ~/inventory build_itrust.yml ```
     
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

-----------------------------------------  

