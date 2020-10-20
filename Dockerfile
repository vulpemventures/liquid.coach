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

RUN ls -la
# Bundle React App
RUN yarn bundle

FROM nginx:alpine
COPY --from=builder /app/dist /var/share/nginx/html