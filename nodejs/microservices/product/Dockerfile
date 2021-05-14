FROM node:12.18-alpine
ENV NODE_ENV=production
WORKDIR /src
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3003
CMD ["node", "microservices/product/productapi.js"]
