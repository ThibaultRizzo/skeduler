#!/bin/bash

source bin/activate.sh

flask create_db
flask create_company
cd -
