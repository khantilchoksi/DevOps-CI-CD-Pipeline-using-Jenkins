# DevOps-Project:Milestone 4 SPECIAL - Kubernetes Cluster Monitoring
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
* [Milestone3](https://github.ncsu.edu/khchoksi/DevOps-Project/blob/milestone3/README.md)  


---------------------------------------------------------------------------

## Contribution 
   * *Kubernetes Dashboard:*  Khantil & Navjot
   * *Jenkins Slackbot Integration:* Khelan & Pavithra
   * *Screencast:* Navjot ,Khantil, Khelan, Pavithra  
   
--------------------------------------------  
## Screencasts
* [Product Screencast]() 

-------------------------------------------------  
## Project Environment Setup:
* In our DevOps pipeline, one Kubernetes cluster containing one master and three slave nodes (EC2 instances) are configured for Dockerized version of checkbox.io. We have three pods (nginx, mongodb and checkbox) and respective three services already running.
------------------------------------------------- 
   
## Kubernetes Cluster Monitoring:

* By using proper tools, we can have good visibility into our containerized infrastructure and its orchestration. 
![img](/monitoring/basic_monitoring.png)    

* *Heapster: Kubernetes’ own metrics collector:*   
    * Heapster is for now the go-to source for basic resource utilization metrics and events from our Kubernetes cluster.   
    * On each node, **cAdvisor** collects data about running containers that Heapster then queries through the kubelet of the node. The following solution to collect Kubernetes metrics, will give you more details on how Heapster works and how to configure it for with Grafana and Kubernetes dashboard.  
    ![img](/monitoring/monitoring_diagram.png)    
  --------------------------------------------------------------------------

### Implementation:
1. Kubernetes cluster is already setup or see instructions (https://github.ncsu.edu/khchoksi/DevOps-Project/tree/milestone3).  

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

### [Deployment Screencast](https://youtu.be/sxkNuhQBr7Y) 


---------------------------------------------------------

---------------------------------  

## References  
   * 


