# DB Migrations

> Full information on [Notion](https://www.notion.so/yuccadigital/Migrations-aea7924de34a40158023d6d7ac3d40b8)

```shell
# create migrations
npx db-migrate create MIGRATION_NAME --sql-file

# run migrations
npx db-migrate up

# chose environment
npx db-migrate up -e local
npx db-migrate up -e review-db
```
