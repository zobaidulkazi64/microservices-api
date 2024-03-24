## 1. Install dependencies
```bash
npm init -y
yarn add  prisma typescript ts-node @types/node --save-dev
npx tsc --init
npx prisma init
```

## 2. Run migrations
```bash
npx prisma migrate dev
```