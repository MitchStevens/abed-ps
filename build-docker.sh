#!/bin/bash

docker build -t abed .
docker run -d --name abed-running --app -p 8080:80 abed