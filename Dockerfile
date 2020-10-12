FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json config
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install app dependencies
RUN pnpm install
# If you are building your code for production
# RUN pnpm ci --only=production

# Bundle app source
COPY . .

# Define exposed port
EXPOSE 8080

# Start node
CMD ["pnpm", "start"]
