FROM node:18-alpine

# Install necessary packages
RUN apk add --no-cache wget bash

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Add wait-for-it script
ADD https://github.com/vishnubob/wait-for-it/raw/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 3000

# Use sh instead of bash for the entry command
CMD sh -c "/wait-for-it.sh mysql:3306 --timeout=60 -- node app.js"
