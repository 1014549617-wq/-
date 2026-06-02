#!/bin/bash
# ============================================
#  DEPRIVATION PROJECT · 剥夺计划
#  启动脚本
# ============================================

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# 生产模式：后端托管前端
if [ "$1" = "prod" ]; then
  echo "╔══════════════════════════════════════════╗"
  echo "║  DEPRIVATION PROJECT · 生产模式         ║"
  echo "╚══════════════════════════════════════════╝"

  # 构建前端
  echo "[1/2] 构建前端..."
  cd "$PROJECT_ROOT/client"
  npm run build

  # 启动后端（自动托管前端）
  echo "[2/2] 启动生产服务器..."
  cd "$PROJECT_ROOT/server"
  NODE_ENV=production node server.js
  exit 0
fi

# 开发模式：前后端分离
echo "╔══════════════════════════════════════════╗"
echo "║  DEPRIVATION PROJECT · 开发模式         ║"
echo "╚══════════════════════════════════════════╝"

# 启动后端
echo "[1/2] 启动后端 API 服务 (端口 3001)..."
cd "$PROJECT_ROOT/server"
node server.js &
SERVER_PID=$!
echo "    后端 PID: $SERVER_PID"

sleep 2

# 启动前端开发服务器
echo "[2/2] 启动前端开发服务器 (端口 5173)..."
cd "$PROJECT_ROOT/client"
npx vite --port 5173 --host &
CLIENT_PID=$!
echo "    前端 PID: $CLIENT_PID"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  剥夺计划已上线                          ║"
echo "║  前端: http://localhost:5173             ║"
echo "║  后端: http://localhost:3001             ║"
echo "║  健康检查: http://localhost:3001/api/health ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo "或运行: kill $SERVER_PID $CLIENT_PID"

trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null; echo '已停止'; exit" INT TERM
wait
