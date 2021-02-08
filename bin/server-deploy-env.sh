#!/bin/bash

eval `ssh-agent -s`
ssh-add .ssh/thibault-skeduler-test.pem
scp backend/.env.prod ubuntu@15.237.145.109:./projects/skeduler/backend
ssh ubuntu@15.237.145.109 << EOF
    mv projects/skeduler/backend/.env.prod projects/skeduler/backend/.env
