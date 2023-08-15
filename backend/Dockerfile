FROM node:18-alpine

WORKDIR /opt/asl-backend
COPY package.json package-lock.json ./
RUN npm ci
RUN apk add --no-cache file
RUN apk --update add imagemagick
RUN apk --no-cache add msttcorefonts-installer fontconfig && \
 update-ms-fonts && \
 fc-cache -f

CMD ["npm", "run", "start"]