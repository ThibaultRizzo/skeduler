#!/bin/bash

INSTANCE_ID="i-0950110f29e3a3416"

aws ec2 start-instances --instance-ids $INSTANCE_ID
