FROM mhart/alpine-node:5.7

ENV NODE_ENV production

ARG CONTAINER_TAG
ENV CONTAINER_TAG ${CONTAINER_TAG:-""}

COPY package.json /slate/
COPY index.js /slate/
COPY server.js /slate/
COPY src /slate/src/
RUN cd /slate  && \
    npm install

EXPOSE 7000
WORKDIR /slate
CMD node --max_old_space_size=128 server.js
