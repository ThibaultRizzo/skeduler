#!/bin/bash


eval `ssh-agent -s`
ssh-add ./.ssh/thibault-skeduler-test.pem

./constants.sh
print($IP_ADDRESS)

ssh ubuntu@$IP_ADDRESS<< EOF
    cd projects/skeduler
    git checkout master
    git pull
    docker-compose -f docker-compose.prod.yml up -d --build