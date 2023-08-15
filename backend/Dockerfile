FROM node:18-alpine

WORKDIR /opt/asl-backend
COPY package.json package-lock.json ./
RUN npm ci

CMD ["npm", "run", "start"]