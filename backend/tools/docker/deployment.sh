#!/bin/bash

# Check if the port argument is provided
if [ -z "$1" ]; then
    echo "Port argument is missing. Exiting..."
    exit 1
fi

# Assign the port argument to a variable
port="$1"

# install and configure docker on the ec2 instance
sudo yum update -y
sudo amazon-linux-extras install docker -y
sudo service docker start
sudo systemctl enable docker

# create a dockerfile

# build the docker image
#sudo docker build -t <image-tag>
cd ../../build/ 
sudo docker build -t backend .

# login to your docker hub account
#cat ~/my_password.txt | sudo docker login --username <your-docker-id> --password-stdin
cat ~/docker_password.txt | sudo docker login --username xlin123 --password-stdin

# use the docker tag command to give the image a new name
#sudo docker tag <image-tag> <repository-name>
sudo docker tag alpine-box xlin/resumerepo

# push the image to your docker hub repository
#sudo docker push <repository-name>
sudo docker push xlin/resumerepo

# start the container to test the image
#sudo docker run -dp 80:80 <repository-name> 
sudo docker run -dp 80:80 xlin/resumerepo