#!/bin/bash


cd server
python3 setup.py bdist_wheel

python3 -m venv venv
. venv/bin/activate
pip install dist/skeduler-0.0.1-py3-none-any.whl