FROM node as builder
WORKDIR /app/

COPY package.json .
RUN npm i -g nodemon
RUN npm install
COPY . .

FROM node
WORKDIR /app/
RUN npm i -g nodemon
COPY --from=builder /app/ .
EXPOSE 3000
ENTRYPOINT ["node", "src/app.js"]
