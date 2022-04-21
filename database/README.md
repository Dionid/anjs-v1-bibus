# DB Migrations

```shell
# create schema-migrations
npx db-migrate create MIGRATION_NAME --sql-file

# run schema-migrations
npx db-migrate up

# chose environment
npx db-migrate up -e local
npx db-migrate up -e review-db
```

# CI/CD

1. Build
   1. Apps
   2. Migrations
2. Scale down
3. Migration up
4. Success
   1. Scale up new version
5. Failure
   1. Manually
