# 使用官方 Node.js 镜像
FROM node:18.17.0

# 设置工作目录为 /app
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 将 package.json 和 pnpm-lock.yaml 复制到容器的工作目录
COPY package.json pnpm-lock.yaml ./

# 使用 pnpm 安装依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 构建项目（如果有 build 步骤）
RUN pnpm run build

# 暴露端口
EXPOSE 3322

# 启动应用
CMD ["pnpm run start:prod"]
