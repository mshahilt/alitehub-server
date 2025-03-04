# Use an official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to take advantage of Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the application port (5000 instead of 3000)
EXPOSE 5000

# Run the app (use npm run dev for development)
CMD ["npm", "run", "dev"]
