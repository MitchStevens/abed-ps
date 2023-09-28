#!/bin/bash

npm install
npm run build
python3 -m http.server 8080 -d ./dist