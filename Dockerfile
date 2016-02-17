FROM node:5.4.1
EXPOSE 7000

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install && \
    npm install -g bower grunt-cli

CMD node --max_old_space_size=128 server.js
