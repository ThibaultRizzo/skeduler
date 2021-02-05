#!/bin/bash

# Update snapd
sudo snap install core; sudo snap refresh core

# Remove certbot-auto
sudo apt-get remove certbot

# Install certbot
sudo snap install --classic certbot

# Prepare the certbot command
sudo ln -s /snap/bin/certbot /usr/bin/certbot