#!/bin/bash


eval `ssh-agent -s`
ssh-add ./.ssh/thibault-skeduler-test.pem

ssh ubuntu@15.237.145.109 << EOF
    cd projects/skeduler
    git checkout master
    git pull
    docker-compose -f docker-compose.prod.yml up -d --build