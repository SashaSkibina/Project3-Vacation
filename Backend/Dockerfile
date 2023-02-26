FROM node:18-alpine
WORKDIR  /backend
# WORKDIR  "/Project3Vacation/backend/"
RUN npm install -g npm@9.1.1
RUN npm i -g ts-node
RUN npm i -g nodemon
# RUN npm config set http-proxy http://<my company proxy>:8099
# RUN npm config set https-proxy http://<my company proxy>:8099

COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
# COPY package.json /Project3Vacation/backend/
# COPY package-lock.json /Project3Vacation/backend/
RUN npm install
EXPOSE 3100

ENTRYPOINT npm run server
