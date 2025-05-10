# Base image with Node
FROM node:18

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the Vue app for production
RUN npm run build

# Install serve to host the app
RUN npm install -g serve

# Start the app
CMD ["serve", "-s", "dist"]


EXPOSE 3000
