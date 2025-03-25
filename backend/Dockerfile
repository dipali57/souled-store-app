# Use Node.js base image
FROM node:18-alpine 

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app source
COPY . .

# Expose port 3000
EXPOSE 3000

# Start NestJS
CMD ["npm", "run", "start:prod"]
