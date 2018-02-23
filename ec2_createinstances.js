//'use strict';
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-west-2'});

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});


//Creating Security Group
var SecurityGroupId;

var paramsSecurityGroup = {
   Description: 'SecurityGroupforSSH', // required 
   GroupName: 'SSHGroup', // required 
   DryRun: false
};
// Create the instance
ec2.createSecurityGroup(paramsSecurityGroup, function(err, data) {
   if (err) {
      console.log("Security Group Error");
   } else {

      SecurityGroupId = data.GroupId;
      console.log("Success", SecurityGroupId);
      var paramsIngress = {
        GroupName: 'SSHGroup',
        IpPermissions:[
          {
              IpProtocol: "-1",
              FromPort: 0,
              ToPort: 65535,
              IpRanges: [{"CidrIp":"0.0.0.0/0"}]
          }
        ]
      };
      ec2.authorizeSecurityGroupIngress(paramsIngress, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Ingress Successfully Set", data);
        }
     });
   }
});


var keyPairName='HW1_Key'
var params = {
   KeyName: keyPairName
};

var myKey;
// Create the key pair
ec2.createKeyPair(params, function(err, data) {
   if (err) {
      console.log("Key Pair already exist");
   } else {
      //console.log(JSON.stringify(data.KeyMaterial));
      myKey=data.KeyMaterial;
      const fs = require('fs');

      var dir = '/home/vagrant/keys/';
      let filePath=dir+keyPairName+'.pem'

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      
      let buffer = new Buffer(myKey);
      
      // open the file in writing mode, adding a callback function where we do the actual writing
      fs.open(filePath, 'w', function(err, fd) {  
          if (err) {
              throw 'could not open file: ' + err;
          }
      
          // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
          fs.write(fd, buffer, 0, buffer.length, null, function(err) {
              if (err) throw 'error writing file: ' + err;

              fs.chmod(filePath, 0400, (error) => {
                console.log('\n Modify file permission');
              });

              fs.close(fd, function() {
                  console.log('wrote the key successfully');
              });
          });

          
      });


   }
});

var instanceId=null;
var publicDNS=null;

 params = {
    ImageId: 'ami-79873901',
    InstanceType: 't2.micro',
    MinCount: 1,
    MaxCount: 1,
    KeyName: 'HW1_Key',
    SecurityGroups: ['SSHGroup']
 };

 // Create the instance
 ec2.runInstances(params, function(err, data) {
    if (err) {
       console.log("Could not create instance", err);
       return;
    }
    instanceId = data.Instances[0].InstanceId;
    //publicDNS = data.Instances[0].PublicDNS;
    console.log("Created instance", instanceId);
    // Add tags to the instance
    params = {Resources: [instanceId], Tags: [
       {
          Key: 'HW1 Instance',
          Value: 'HW1 AWS Instance'
       }
    ]};
    ec2.createTags(params, function(err) {
       console.log("Tagging instance", err ? "failure" : "success");
    });

    // call EC2 to start the selected instances
    params = {
      InstanceIds: [instanceId],
      DryRun: false
    };
     
    ec2.startInstances(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else if (data) {
          //console.log("Success", data.StartingInstances);

        }
    });

    
    params = {
      InstanceIds: [instanceId],
      DryRun: false
    };

    ec2.describeInstances(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {


         //---- Write inventory File
         const fs = require('fs');
         let filePath='/home/vagrant/inventory';
         var tag= '\n['+process.argv[2]+']\n';
         var buffer = data.Reservations[0].Instances[0].PublicDnsName+' ansible_ssh_user=ubuntu ansible_ssh_private_key_file=../keys/'+keyPairName+'.pem\n';
         // open the file in append mode
     
         // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
         fs.appendFile(filePath,tag,function(err) {
             if (err) throw 'error writing file: ' + err;
         });

         fs.appendFile(filePath, buffer, function(err) {
             if (err) throw 'error writing file: ' + err;
         });

      }
          
    });

 });





