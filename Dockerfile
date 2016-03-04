FROM gliderlabs/alpine:3.3

RUN apk add --update nodejs

COPY package.json /slate/
COPY index.js /slate/
COPY server.js /slate/
COPY src /slate/src/
RUN cd /slate  && \
    npm install --production

EXPOSE 7000
WORKDIR /slate
CMD node --max_old_space_size=128 server.js
