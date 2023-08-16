FROM node:18-alpine

WORKDIR /opt/asl-backend
COPY . .
RUN npm ci
RUN apk add --no-cache file
RUN apk add --no-cache python3 ffmpeg git
RUN apk add --no-cache py3-pip
RUN pip3 install git+https://github.com/TheB0SS37/moviepy.git@latin-1
RUN apk --update add imagemagick
RUN apk --no-cache add msttcorefonts-installer fontconfig && \
 update-ms-fonts && \
 fc-cache -f

CMD ["npm", "run", "start"]