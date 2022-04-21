FROM node:16.4.2 as builder

WORKDIR /app

RUN yarn add db-migrate db-migrate-pg

COPY schema-migrations ./migrations
COPY ./database.json .
COPY .db-migraterc .

ENTRYPOINT [ "/bin/bash" ]