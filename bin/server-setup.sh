#!/bin/bash
sudo apt update


# Install node latest
sudo apt install nodejs
sudo apt install npm
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
# alias dc='docker-compose'

# Install nginx
# sudo apt install nginx

# Add docker permission to ubuntu user
sudo usermod -aG docker ubuntu

# Create symlink at docker-compose file level
# ln -s /etc/letsencrypt/live/skeduler.eu/ ./certs

# Install code-agent
# sudo apt-get install ruby -y
# sudo apt-get install wget
# cd /home/ubuntu
# wget https://aws-codedeploy-eu-west-3.s3.eu-west-3.amazonaws.com/latest/install
# chmod +x ./install
# sudo ./install auto

# Start codedeploy agent
# sudo service codedeploy-agent start