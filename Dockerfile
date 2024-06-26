FROM node:16

COPY package*.json ./

WORKDIR /opt/server/backend-test

COPY . /opt/server/backend-test/

RUN npm install
EXPOSE 5000
CMD [ "node", "app.js" ]
