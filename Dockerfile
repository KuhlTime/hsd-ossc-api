###############
# BUILD STAGE #
###############

FROM node:lts-alpine as build

# Select working directory
WORKDIR /usr/src/app

# Diable npm update message
RUN npm config set update-notifier false

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Build app
COPY . .
RUN npm run build


#############
# RUN STAGE #
#############

FROM node:lts-alpine

# Select working directory
WORKDIR /usr/src/app

# Diable npm update message
RUN npm config set update-notifier false

# Install production dependencies
COPY package*.json ./
RUN npm ci

# Copy /dist folder from build stage
COPY --from=build /usr/src/app/dist ./dist

# Start the server
EXPOSE 8080
CMD npm start
