# ---- Base Node ----
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production and dev dependencies
RUN npm install

COPY . .
RUN npm run build

# --- Release with Alpine ----
FROM node:18-alpine AS release

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

ENV DATABASE_URL=postgres://root:root@localhost:5432/metamask_login
ENV JWT_SECRET=secret

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
