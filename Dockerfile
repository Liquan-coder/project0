FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# 不要用 nginx，直接啟動開發伺服器
CMD ["npx", "expo", "start", "--web"]