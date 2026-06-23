# Step 1 - Node environment
FROM node:18-alpine

# Step 2 - Working directory
WORKDIR /app

# Step 3 - Copy package.json
COPY package*.json ./

# Step 4 - Install dependencies
RUN npm install

# Step 5 - Copy all files
COPY . .

# Step 6 - Build React app
RUN npm run build

# Step 7 - Install serve to run build
RUN npm install -g serve

# Step 8 - Expose port
EXPOSE 3000

# Step 9 - Start app
CMD ["serve", "-s", "build"]