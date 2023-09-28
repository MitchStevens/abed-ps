FROM alpine:latest
RUN apk add npm python3
WORKDIR ./abed
COPY ./dist ./src ./package.json ./packages.dhall spago.dhall  ./abed

RUN npm run build
# RUN python3 -m http.server 8080