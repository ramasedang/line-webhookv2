FROM node:16.15.1-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "run", "start"]