from slacker import Slacker
import argparse
import boto.ec2
import urllib
import schedule
import time
import datetime
import os

access_key = ''
secret_key = ''
list_ip_address = []
list_tag_name = []
SLACK_TOKEN = os.env['SLACK_API_TOKEN']

def get_ec2_instances(region):
    ec2_conn = boto.ec2.connect_to_region(region,
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key)
    reservations = ec2_conn.get_all_reservations()

    for reservation in reservations:
        for instances in reservation.instances:
            print "%s \t \t %s" % (instances.tags['Name'], instances.ip_address)
            if(instances.tags['Name'].startswith("itrust")):
                list_ip_address.append(instances.ip_address)
                list_tag_name.append(instances.tags['Name'])
                print "added", instances.ip_address

    for reservation in reservations:    
        print region+':',reservation.instances

    for vol in ec2_conn.get_all_volumes():
        print region+':',vol.id

    
def main():
    regions = ['us-east-1','us-west-1','us-west-2','eu-west-1','sa-east-1',
                'ap-southeast-1','ap-southeast-2','ap-northeast-1']
    parser = argparse.ArgumentParser()
    parser.add_argument('access_key', help='Access Key');
    parser.add_argument('secret_key', help='Secret Key');
    args = parser.parse_args()
    global access_key
    global secret_key
    access_key = args.access_key
    secret_key = args.secret_key
    
    for region in regions: get_ec2_instances(region)

def slack():
    print list_ip_address
    slack = Slacker(SLACK_TOKEN)
    # Send a message to #general channel
    slack.chat.post_message('#notification', 'Hello fellow slackers!Automatic msg from Khelan')
    slack.chat.post_message('#team', "-------------------------------------------------")
    for ip in list_ip_address:
        try:
            status = urllib.urlopen("http://"+ip+":8080/iTrust2").getcode()
        except:
            status = 400
        index = list_ip_address.index(ip)
        tag = list_tag_name[index]
        msg = str(tag)+ " | iTrust IP : "+ip+" status is :--> "+str(status)+" | time: "+str(datetime.datetime.now())
        slack.chat.post_message('#team', msg)
        print status

schedule.every(20).seconds.do(slack)
    
if  __name__ =='__main__':
   main()
   slack()
   while True:
       schedule.run_pending()
       time.sleep(1)
       #main()
       #slack()
    

