#!/bin/bash

# required for purescript autocomplete
cat ./package.json | jq '.devDependencies | keys[] as $k | "\($k)@\(.[$k])"' | xargs -t npm install -g