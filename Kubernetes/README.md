This repository contains Ansible environment for:

- Setting up kubernetes on bare metal VM as per described in this page:

http://kubernetes.io/docs/getting-started-guides/centos/centos_manual_config/

- Securing kubernetes API server as per described in this page, but with easy-rsa instead of openssl to generate the certificate sets:

http://rootsquash.com/2016/05/10/securing-the-kubernetes-api/

# Setup

Prepare 4 (four) CentOS-7 64-bit Server machines with minimal installation. They can be it in a VM, AWS, or any other platform, and they have to be able to route to each other using IPv4 addresses.

The hostnames of the machines are:
- `kube-master`
- `kube-minion-1`
- `kube-minion-2`
- `kube-minion-3`

All of these hostnames need to be resolved via DNS. Change the inventory file and host vars if you wish the use different hostnames.

Edit the `inventory/kube-cluster` file and adjust the IP addresses of the machines.

# Run the playbook

The playbook and the roles were tested using Ansible (v2.1.2.0) Fedora 25 workstation.

Setup the master node:

```
$ ansible-playbook -i inventory/kube-cluster playbooks/kube-masters.yaml
```

Setup the minion nodes:

```
$ ansible-playbook -i inventory/kube-cluster playbooks/kube-minions.yaml
```

Watch until all the tasks finished.
