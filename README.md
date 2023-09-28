

# Getting started

Install npm deps:
`npm install`

Build guitar app
`npm run build`


Use this command to install dev deps locally (for dev usage only):
`cat ./package.json | jq '.devDependencies | keys[] as $k | "\($k)@\(.[$k])"' | xargs -t npm install -g`