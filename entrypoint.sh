#!/bin/sh
set -e

npm ci
npx prisma generate
npx prisma migrate dev
npm run dev -- --host 