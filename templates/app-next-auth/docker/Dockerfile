FROM node:20

WORKDIR /usr/app/

COPY package*.json ./

RUN npm cache clean --force

RUN npm install --no-optional && npm cache clean --force

ENV PATH /usr/app/node_modules/.bin:$PATH

WORKDIR /usr/app/main

COPY . .

ARG LOCAL

RUN if [ "$LOCAL" != true ]; then npm run build; fi

CMD npm run start
