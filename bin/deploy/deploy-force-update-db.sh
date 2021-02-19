#!/bin/bash

eval `ssh-agent -s`
ssh-add ./.ssh/thibault-skeduler-test.pem

. ./bin/constants.sh

ssh ubuntu@$IP_ADDRESS <<START
    docker exec backend flask db stamp head
    docker exec backend flask db migrate
    docker exec backend flask db upgrade
    docker exec backend flask create_db
    docker exec backend flask create_company
START