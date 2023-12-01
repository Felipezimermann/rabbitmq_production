FROM node:latest  
RUN apt-get update && apt-get install -y default-jdk

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

RUN npm install
# Bundle app source
COPY . /usr/src/app
EXPOSE 3011
CMD ["npm","start"]
