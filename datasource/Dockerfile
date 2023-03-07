# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY app.js ./
COPY data ./data
# Expose port 3000 for the application
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
