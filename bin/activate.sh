#!/bin/bash

cd server

source venv/Scripts/activate

export FLASK_APP=main.py
export FLASK_ENV=development