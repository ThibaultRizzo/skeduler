#!/bin/bash
sudo apt update

# Install node latest
sudo npm cache clean -f
sudo npm install -g npm@latest
sudo npm install -g n
sudo n stable
sudo reboot # Not sure if useful

# Uninstall old versions of docker
sudo apt-get remove docker docker-engine docker.io

# Install docker
sudo apt install docker.io -y

# Start and automate docker
sudo systemctl start docker
sudo systemctl enable docker

# Install docker-compose
sudo curl -L https://github.com/docker/compose/releases/download/1.28.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Prepare aliases
alias dc='docker-compose'

# Install nginx
sudo apt install nginx

# Add docker permission to ubuntu user
sudo usermod -aG docker ubuntu