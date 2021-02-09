#!/bin/bash

eval `ssh-agent -s`

# IP_ADDRESS="15.237.145.109" # Micro instance
IP_ADDRESS="13.36.30.133" # Medium instance

ssh-add .ssh/thibault-skeduler-test.pem
scp backend/.env.prod ubuntu@$IP_ADDRESS:./projects/skeduler/backend
scp -r certs ubuntu@$IP_ADDRESS:./projects/skeduler

ssh ubuntu@$IP_ADDRESS << EOF
    mv projects/skeduler/backend/.env.prod projects/skeduler/backend/.env
