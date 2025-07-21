#!/bin/sh
set -e

npm ci
npx prisma generate
npx prisma migrate deploy
npm run dev -- --host 