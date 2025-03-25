FROM node:18-alpine

WORKDIR /opt/asl-frontend
COPY package*.json .
RUN npm install
COPY . .

CMD ["npm", "run", "start"]