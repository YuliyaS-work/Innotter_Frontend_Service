FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install @tanstack/react-query
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]