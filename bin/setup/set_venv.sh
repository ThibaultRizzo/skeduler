#!/bin/bash

cd backend

python -m venv venv
source venv/Scripts/activate
python -m pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
cd -