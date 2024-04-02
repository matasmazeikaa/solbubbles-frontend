# Use an official Node.js LTS (Long Term Support) version as base image
FROM node:lts-alpine as build-stage

# Set working directory in the container
WORKDIR /app

# Copy both package.json and package-lock.json (if available)
COPY package*.json ./

# Install Python
RUN apk add --no-cache python3

# Set Python 3 as the default python interpreter
RUN ln -sf python3 /usr/bin/python

# Install dependencies
RUN npm install --force

# Copy the entire project over
COPY . ./

# Build Vue application
RUN npm run build

# Expose port 5173
EXPOSE 5173

# Start nginx
CMD ["npm", "run", "server"]
