FROM node:18.12.1-bullseye-slim

# Create a non-root user
RUN useradd -m -d /app barista

# Copy files to non-root user home directory
WORKDIR /app
COPY src/ ./src
COPY package.json ./

# Install necessary packages
RUN npm install

# Switch to non-root user
USER barista

EXPOSE 3000

ENTRYPOINT ["node", "src/main.js"]