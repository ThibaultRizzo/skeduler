#!/bin/bash

eval `ssh-agent -s`
ssh-add ./.ssh/thibault-skeduler-test.pem
# ssh ubuntu@15.237.145.109
ssh ubuntu@35.181.44.154