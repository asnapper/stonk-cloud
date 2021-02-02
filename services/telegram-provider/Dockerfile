FROM asnapper/stonk-common:latest AS common

FROM node:14 as build

WORKDIR /src/build
ADD package*.json ./
RUN npm install
ADD . .
COPY --from=common / ../common
RUN npm run build

FROM node:14 as runtime

WORKDIR /app
COPY --from=build /src/build/dist .
EXPOSE 3000
ADD package*.json ./
RUN npm install --production

CMD ["node", "build/src/main.js"]