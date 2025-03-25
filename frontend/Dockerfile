# Use Node.js base image
FROM node:18-alpine 

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app source
COPY . .

# Build the app
RUN npm run build

# Expose port 5173 (Vite default)
EXPOSE 5173

# Run the app
CMD ["npm", "run", "preview"]