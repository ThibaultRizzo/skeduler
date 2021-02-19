#!/bin/bash


eval `ssh-agent -s`
ssh-add ./.ssh/thibault-skeduler-test.pem

. ./bin/constants.sh

ssh ubuntu@$IP_ADDRESS <<START
    cd projects/skeduler
    git checkout dev
    git pull
    docker-compose -f docker-compose.prod.yml up -d --build
START