FROM node:18
WORKDIR /app
COPY ./package*.json .
RUN npm install
COPY ./.env .
COPY . .
CMD ["npm", "run", "docker:start"]
