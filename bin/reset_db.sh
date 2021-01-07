#!/bin/bash
source bin/activate.sh

rm -rf migrations
flask db init
flask db migrate
flask db upgrade
