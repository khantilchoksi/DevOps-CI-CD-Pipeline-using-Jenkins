// Load the SDK for JavaScript
var AWS = require('aws-sdk');
const fs = require('fs');
// Set the region 
AWS.config.update({region: 'us-east-2'});

// // Load the AWS SDK for Node.js
// var AWS = require('aws-sdk');
// // Set the region 
// AWS.config.update({region: 'us-west-2'});

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

//var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
//AWS.config.credentials = credentials;

var securityGroupId;
var keyValuePair;
var securityGroupName = 'ProjectSecGroup3';//MySecurityGroup
var keyName = 'Project_KeyPair3';//DevOpsKeyPair
var vmName = 'JenkinsServer3';//ProvisionedServer


//Creating Security Group
var paramsSecurityGroup = {
    Description: 'Jenkins Sec DevOps', // required 
    GroupName: securityGroupName, // required 
    //DryRun: false,
  };
//   ec2.createSecurityGroup(params, function(err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else  {
//         console.log(data);           // successful response
//         groupId = data.GroupId;
//     }   
//   });

function createEC2Instance(){
  //Create Security Group
  return new Promise(function(resolve, reject){
    ec2.createSecurityGroup(paramsSecurityGroup, function(err, data) {
      if (err) {
         console.log("Error", err);
      } else {
         securityGroupId = data.GroupId;
         console.log("Success", securityGroupId);
         var paramsIngress = {
           GroupName: securityGroupName,
           IpPermissions:[
              {
                 IpProtocol: "tcp",
                 FromPort: 22,
                 ToPort: 22,
                 IpRanges: [{"CidrIp":"0.0.0.0/0"}]
             },
             {
              IpProtocol: "tcp",
              FromPort: 80,
              ToPort: 80,
              IpRanges: [{"CidrIp":"0.0.0.0/0"}]
            },
           ]
         };
         ec2.authorizeSecurityGroupIngress(paramsIngress, function(err, data) {
           if (err) {
             console.log("Error", err);
             reject(err);
           } else {
             //console.log("Ingress Successfully Set", data);
             resolve(data);
           }
        });
  
        //Create key
  
        //create instance
      }
   });
  })

}

var securityGroupPromise = createEC2Instance();
securityGroupPromise.then(function(result){
    //Security Group Created
    return new Promise(function (resolve, reject){
      //Now Create Key Value Pair
        var privateKey;
        var params = {
          KeyName: keyName
        };

          ec2.createKeyPair(params, function(err, data) {
            if (err){

             console.log(err, err.stack); // an error occurred
             reject(err);
            }
            else  {
              //console.log(data);           // successful response
              privateKey = data.KeyMaterial;



              //--------------------------writing key to file
              
              var fileName = keyName+'.pem';
              var dir = '/home/vagrant/keys/';
              let path = dir+fileName;
              
              if (!fs.existsSync(dir)){
                      fs.mkdirSync(dir);
              }

              let buffer = new Buffer(privateKey);
              console.log('\n ------- Writing SSH Private Key to .pem file ---------- ');
              // open the file in writing mode, adding a callback function where we do the actual writing
              fs.open(path, 'w', function(err, fd) {  
                  if (err) {
                      throw 'could not open file: ' + err;
                  }
              
                  // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
                  fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                      if (err) throw 'error writing file: ' + err;

                      fs.chmod(path, 0400, (error) => {
                        console.log('RSA Private Key File permissions chagned to 400.');
                      });

                      fs.close(fd, function() {
                          //console.log('wrote the file successfully');
                      });
                  });

                  resolve(privateKey);


              });
            }   
          });


    })
},function(securityGroupCreationError){
  console.log(securityGroupCreationError);
}).then(function (keyPairResult){
    //Key Pair Successfully Created
    //Create EC2 Instance
    var params = {
      ImageId: 'ami-965e6bf3', // amzn-ami-2011.09.1.x86_64-ebs
      InstanceType: 't2.micro',
      MinCount: 1,
      MaxCount: 1,
      SecurityGroups: [securityGroupName],
      KeyName: keyName
   };
   
   //------------Create the instance
   return new Promise(function(resolve, reject){
    ec2.runInstances(params, function(err, data) {
      if (err) {
         console.log("Could not create instance", err);
         return;
      }
      var instanceId = data.Instances[0].InstanceId;
      //var publicDnsName = data.Instances[0].PublicDnsName;
      console.log("\n ---------- New AWS EC2 instance created----------");
      console.log("Instance ID: ", instanceId);
      //console.log("Public DNS NAME:", publicDnsName);
      // Add tags to the instance
      
      params = {Resources: [instanceId], Tags: [
         {
            Key: 'Name',
            Value: vmName
         }
      ]};
   
      ec2.createTags(params, function(err) {
         console.log("Tagging instance", err ? "failure" : "success");
      });
   
      var params = {
       InstanceIds: [ //required
         instanceId,
         // more items
       ],
       AdditionalInfo: 'No Additional Info',
       DryRun: false
     };
   
     ec2.startInstances(params, function(err, data) {
       if (err){
        console.log(err, err.stack); // an error occurred
        reject(err);
       }
       else  {
           //console.log(data);           // successful response
           console.log("Instance is being started ..... ");
           resolve(instanceId);
           //console.log("Success", JSON.stringify(data.StartingInstances[0].CurrentState));
       }   
     });
   })


},function(keyPairError){
  console.log(keyPairError);
}).then(function(instanceIDResult){
  //InstanceSuccessfully Created
  var params = {
    DryRun: false,
    InstanceIds: [
      instanceIDResult,
      // more items 
    ],
  };
  ec2.describeInstances(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
        //console.log(data);           // successful response
        //console.log("\n ---- \n"+data.Reservations[0].Instances); 
        
        var reservation = data.Reservations[0];
        for(var i=0,ilen=reservation.Instances.length; i<ilen; ++i) {
            var instance = reservation.Instances[i];

            var name = '';
            for(var t=0,tlen=instance.Tags.length; t<tlen; ++t) {
                if(instance.Tags[t].Key === 'Name') {
                    name = instance.Tags[t].Value;
                }
            }
            //console.log('\n\t'+name+'\t'+instance.InstanceId+'\t'+instance.PublicIpAddress+'\t'+instance.PublicDnsName+'\t'+instance.PrivateIpAddress+'\t'+instance.InstanceType+'\t'+instance.ImageId+'\t'+instance.State.Name);
            console.log("Instance Name: ",name);
            console.log("Instance ID: ",instance.InstanceId);
            console.log("Instance Public IP Address: ",instance.PublicIpAddress);
            console.log("Instance Public DNS Name: ",instance.PublicDnsName);
            //---- Writing Inventory File
            var fileName = '/home/vagrant/inventory';
            var inventoryEntry = '[jenkins]\n'+instance.PublicDnsName+' ansible_ssh_user=ubuntu '+'ansible_ssh_private_key_file=/home/vagrant/keys/'+keyName+'.pem'+'\n';
            //[AppServer]
            //192.168.33.100 ansible_ssh_user=vagrant ansible_ssh_private_key_file=../keys/app.key
            fs.appendFile(fileName, inventoryEntry, function(err) {
                if (err) throw 'error writing file: ' + err;
               console.log("\n--------------- AWS EC2 instance Node added to Inventory File!---------------\n\n");
               //  fs.close(fd, function() {
               //      console.log('wrote the file successfully');
               //  });
            });
        }
    }    
  });


 }); 
})