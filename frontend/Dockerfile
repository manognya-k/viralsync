# Use Node.js base image 
FROM node:18

# Set working directory
WORKDIR /app

# Copy env file
COPY .env .env

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the frontend code
COPY . .

# Build the React app
RUN npm run build

# Serve the built app using serve
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
