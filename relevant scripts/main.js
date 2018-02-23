// Load the SDK for JavaScript
var AWS = require('aws-sdk');

// Set the region 
AWS.config.update({region: 'us-west-2'});

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

var params_run = {
   ImageId: 'ami-79873901', // amzn-ami-2011.09.1.x86_64-ebs
   InstanceType: 't1.micro',
   MinCount: 1,
   MaxCount: 1,
   KeyName: 'devopskeypair'
};

/*var params_details = {
  DryRun: false,
  Filters: [{
  	Name: 'instance-state-name',
  	Values: ['running'
  	]
  }

  ]
};

var params_sec = {
  DryRun: false,
  FromPort: 80,
  GroupName: 'default',
  IpProtocol: '-1',
  ToPort: 80
};


var params = {
  DryRun: false,
  Filters: [
  {
  Name: 'architecture',
  Values: ['x86_64']
  },
  {
  	Name: 'image-type',
  	Values: ['machine']
  },
  {
  	Name: 'root-device-type',
  	Values: ['ebs']
  },
  {
  	Name: 'state',
  	Values: ['available']
  },
  ],
};
*/
// Retrieves all regions/endpoints that work with EC2
/*ec2.describeRegions(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Regions: ", data.Regions);
  }
});
*/

/*ec2.describeImages(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
  	for(var i=0; i<data.length; i++)
		{
			console.log(data[i]["ImageId"] + "  DEscription: " + data[i]["Description"]);
		}
    console.log(data);
  }
});
*/



// Create the instance
ec2.runInstances(params_run, function(err, data) {
   if (err) {
      console.log("Could not create instance", err);
      return;
   }
   var instanceId = data.Instances[0].InstanceId;
   console.log(data.Instances[0]);
   console.log("Created instance", instanceId);
   // Add tags to the instance
   params = {Resources: [instanceId], Tags: [
      {
         Key: 'Name',
         Value: 'SDK Sample'
      }
   ]};
   ec2.createTags(params, function(err) {
      console.log("Tagging instance", err ? "failure" : "success");
   });

ec2.authorizeSecurityGroupIngress(params_sec, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response


});


});




/*ec2.describeInstances(params_details, function(err, data) {
	console.log("Your ip address is " + JSON.stringify(data.Reservations[0].Instances[0].PublicIpAddress));
  if (err) {
    console.log("Error", err.stack);
  } else {
    console.log("Success", JSON.stringify(data));
  }
});



*/