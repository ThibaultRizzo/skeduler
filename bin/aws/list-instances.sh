#!/bin/bash

aws ec2 describe-instances --filters "Name=instance-type,Values=t2.medium" --query "Reservations[].Instances[].{Instance:InstanceId,State:State.Name}"