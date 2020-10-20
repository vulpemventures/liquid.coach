## First Stage

FROM node:latest AS builder
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN yarn install
RUN yarn bundle

## Second Stage

FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/ /usr/share/nginx/html