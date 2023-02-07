#### Stage 1: Build the angular application
FROM node:12 as build

# Configure the main working directory inside the docker image. 
# This is the base directory used in any further RUN, COPY, and ENTRYPOINT 
# commands.
WORKDIR /app

# Copy the package.json as well as the package-lock.json and install 
# the dependencies. This is a separate step so the dependencies 
# will be cached unless changes to one of those two files 
# are made.
COPY package.json package-lock.json ./
RUN npm install

# Copy the main application
COPY . ./

# Build the application
RUN npm run build

#### Stage 2: Serve the Angular application from Nginx 
FROM bitnami/nginx:1.14.2

# Copy the angular build from Stage 1
COPY --from=build /app/dist /var/www

# Copy our custom nginx config
COPY nginx.conf /opt/bitnami/nginx/conf/nginx.conf
