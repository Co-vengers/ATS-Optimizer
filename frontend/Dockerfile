FROM node:18-alpine

WORKDIR /app

# Copy both package files
COPY package*.json ./

# CHANGE: Use 'npm install' instead of 'npm ci' to fix lockfile issues
# and ensure dev dependencies (like Tailwind) are installed.
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start", "--", "--host", "0.0.0.0"]