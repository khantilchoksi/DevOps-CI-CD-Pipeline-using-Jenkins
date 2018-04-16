/usr/bin/etcdctl mkdir /kube-centos/network
/usr/bin/etcdctl mk /kube-centos/network/config "{ \"Network\": \"172.31.0.0/16\", \"SubnetLen\": 24, \"Backend\": { \"Type\": \"vxlan\" } }"
