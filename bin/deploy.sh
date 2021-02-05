#!/bin/bash


eval `ssh-agent -s`
ssh-add ./.ssh/thibault-skeduler-test.pem

ssh ubuntu@35.180.139.108


#  << EOF
    # cd projects