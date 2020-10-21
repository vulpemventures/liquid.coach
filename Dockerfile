FROM node:12 AS builder

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN yarn install --silent
RUN yarn add node-sass

# Move the code inside container
COPY src ./src
COPY public ./public
COPY types ./types
COPY tsconfig.json ./

# Bundle React App
RUN yarn bundle

FROM python:3.7-alpine
COPY --from=builder /app/dist ./app
EXPOSE 7000
CMD python3 -m http.server 7000 --directory ./app