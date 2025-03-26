### 🚀 介绍

CChat 是一个基于 MERN 技术栈（MongoDB、Express、React、Node.js）构建的现代实时聊天应用

主要功能包括：

🔒 GitHub OAuth 认证登录
💬 使用 Socket.io 实现实时通信
🎨 支持亮色/暗色双主题
👥 在线用户状态追踪
📱 响应式设计，采用 daisyUI

### ✨  核心功能

- **安全登录**: GitHub OAuth 2.0 认证
- **实时聊天**: 消息即时传输
- **主题切换**: 支持亮/暗模式切换
- **在线状态**: 实时显示用户在线情况
- **消息历史**: 聊天记录持久化存储
- **响应式界面**: 适配所有设备尺寸

### 🛠 技术栈

| 分类       | 技术                  |
|----------------|-------------------------------|
| 前端       | React, Vite, daisyUI, Socket.io Client |
| 后端        | Node.js, Express, Socket.io   |
| 数据       | MongoDB                       |
| 认证系统 | GitHub OAuth, JWT             |
| 样式设计        | Tailwind CSS                  |

### ⚙️  安装指南

1. 克隆仓库

```bash
git clone https://github.com/yourusername/cchat.git
```

2. 安装依赖

```bash
cd CChat && npm run build 
```

3. 创建 .env 文件
```bash
# ====== BACKEND ======
# ====== Normal ======
MONGODB_URI=
retryWrites=
PORT=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# ====== DEv ====== 
#NODE_ENV=
#GITHUB_CALLBACK_URL=
#FRONTEND_URL=

# ====== Prod ====== 
NODE_ENV=production
GITHUB_CALLBACK_URL=
FRONTEND_URL=



# ====== FRONTED ======
#dev
#VITE_API_BASE_URL=
#VITE_SOCKET_BASE_URL=

#prod
VITE_API_BASE_URL=
VITE_SOCKET_BASE_URL=

#normal
VITE_GITHUB_DOCS_URL=

VITE_PRODUCT_NAME=
```

4. 开发

```bash
# Start backend
npm run dev

# Start frontend
cd client && npm run dev
```

### 🚀 部署

plz view nginx.conf file to see how to deploy this project on nginx server and deploy it on your own server. Or u can use render or vercel to deploy this project.

### 📸 截图

![Chat Interface](/assets/showcase1.png)
![Chat Interface](/assets/showcase2.png)