#!/bin/bash

source bin/activate.sh

flask db migrate
flask db upgrade
cd -