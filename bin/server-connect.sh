#!/bin/bash

eval `ssh-agent -s`
ssh-add ./.ssh/thibault-skeduler-test.pem
# ssh ubuntu@15.237.145.109
ssh ubuntu@13.36.30.133