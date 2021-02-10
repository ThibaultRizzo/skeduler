#!/bin/bash


eval `ssh-agent -s`
ssh-add ./.ssh/thibault-skeduler-test.pem

# IP_ADDRESS="15.237.145.109" # Micro instance
IP_ADDRESS="13.36.30.133" # Medium instance

ssh ubuntu@$IP_ADDRESS <<-EOF
    cd projects/skeduler
    docker-compose -f docker-compose.prod.yml up -d --build