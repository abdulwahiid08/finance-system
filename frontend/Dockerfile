FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
