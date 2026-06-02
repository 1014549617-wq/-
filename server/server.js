import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001
const isProduction = process.env.NODE_ENV === 'production'

app.use(cors())
app.use(express.json())

// ========== 数据库初始化 ==========
const dbPath = join(__dirname, 'deprivation.db')
const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS confessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    day INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS state (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`)

// 初始化全局状态
const stateInit = db.prepare('INSERT OR IGNORE INTO state (key, value) VALUES (?, ?)')
stateInit.run('current_day', '1')
stateInit.run('start_date', new Date().toISOString().slice(0, 10))

// 加载物品池
const itemsPool = JSON.parse(readFileSync(join(__dirname, 'items_pool.json'), 'utf-8'))

// ========== 工具函数 ==========
function getCurrentDay() {
  const row = db.prepare("SELECT value FROM state WHERE key = 'start_date'").get()
  const startDate = new Date(row.value)
  const now = new Date()
  const diffMs = now - startDate
  const day = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
  return Math.min(Math.max(day, 1), 100)
}

function getUnlockedItems(currentDay) {
  return itemsPool.filter(item => item.id <= currentDay)
}

function getTodayAction(currentDay) {
  const item = itemsPool.find(item => item.id === currentDay)
  if (!item) return null
  return {
    action_title: item.action_title,
    action_command: item.action_command,
    item_name: item.name
  }
}

function getTodayChoices(currentDay) {
  const nextItems = itemsPool.filter(item => item.id > currentDay).slice(0, 3)
  if (nextItems.length === 0) {
    const shuffled = [...itemsPool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3).map(item => ({
      id: item.id,
      name: item.name,
      action_title: item.action_title,
      votes: getVoteCount(item.id, currentDay)
    }))
  }
  return nextItems.map(item => ({
    id: item.id,
    name: item.name,
    action_title: item.action_title,
    votes: getVoteCount(item.id, currentDay)
  }))
}

function getVoteCount(itemId, day) {
  const row = db.prepare('SELECT COUNT(*) as count FROM votes WHERE item_id = ? AND day = ?').get(itemId, day)
  return row?.count || 0
}

// ========== API 路由 ==========

// 获取全局状态
app.get('/api/state', (req, res) => {
  const currentDay = getCurrentDay()
  const unlockedItems = getUnlockedItems(currentDay)
  const todayAction = getTodayAction(currentDay)
  const todayChoices = getTodayChoices(currentDay)

  res.json({
    current_day: currentDay,
    total_days: 100,
    unlocked_items: unlockedItems.map(item => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      category: item.category
    })),
    today_action: todayAction,
    today_choices: todayChoices
  })
})

// 投票
app.post('/api/vote', (req, res) => {
  const { choice_id } = req.body
  if (!choice_id) {
    return res.status(400).json({ error: 'MISSING_CHOICE_ID' })
  }

  const currentDay = getCurrentDay()
  const insertVote = db.prepare('INSERT INTO votes (item_id, day) VALUES (?, ?)')
  insertVote.run(choice_id, currentDay)

  res.json({ status: 'VOTE_RECORDED', day: currentDay, choice_id })
})

// 获取告解（支持随机抽样）
app.get('/api/confessions', (req, res) => {
  const random = req.query.random === '3'
  if (random) {
    const rows = db.prepare('SELECT * FROM confessions ORDER BY RANDOM() LIMIT 3').all()
    return res.json({
      confessions: rows.map(r => ({
        id: r.id,
        content: r.content,
        time: new Date(r.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
      }))
    })
  }
  const rows = db.prepare('SELECT * FROM confessions ORDER BY id DESC LIMIT 20').all()
  res.json({
    confessions: rows.map(r => ({
      id: r.id,
      content: r.content,
      time: new Date(r.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
    }))
  })
})

// 提交告解
app.post('/api/confessions', (req, res) => {
  const { content } = req.body
  if (!content || content.trim().length < 30) {
    return res.status(400).json({ error: 'INSUFFICIENT_CONFESSION', message: '筹码不足。你的痛苦或渴望，需要更具体的陈述。' })
  }

  const insert = db.prepare('INSERT INTO confessions (content) VALUES (?)')
  const result = insert.run(content.trim())

  const randomConfessions = db.prepare('SELECT * FROM confessions WHERE id != ? ORDER BY RANDOM() LIMIT 3').all(result.lastInsertRowid)

  res.json({
    status: 'CONFESSION_ACCEPTED',
    random_confessions: randomConfessions.map(r => ({
      id: r.id,
      content: r.content,
      time: new Date(r.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
    }))
  })
})

// 健康检查
app.get('/api/health', (req, res) => {
  const currentDay = getCurrentDay()
  const confessionCount = db.prepare('SELECT COUNT(*) as count FROM confessions').get()?.count || 0
  const voteCount = db.prepare('SELECT COUNT(*) as count FROM votes').get()?.count || 0
  res.json({ status: 'ACTIVE', current_day: currentDay, confessions: confessionCount, votes: voteCount })
})

// ========== 生产环境：托管前端静态文件 ==========
if (isProduction) {
  const clientDist = join(__dirname, '..', 'client', 'dist')
  if (existsSync(clientDist)) {
    app.use(express.static(clientDist))
    // SPA fallback：所有非 API 路由返回 index.html
    app.get('*', (req, res) => {
      res.sendFile(join(clientDist, 'index.html'))
    })
    console.log(`[PRODUCTION] 托管前端静态文件: ${clientDist}`)
  } else {
    console.warn('[WARNING] 前端构建产物不存在，请先运行 cd client && npm run build')
  }
}

// ========== 启动 ==========
app.listen(PORT, '0.0.0.0', () => {
  const currentDay = getCurrentDay()
  console.log(`
╔══════════════════════════════════════════╗
║  DEPRIVATION SYSTEM // 剥夺计划          ║
║  STATUS: ACTIVE                          ║
║  DAY: ${String(currentDay).padStart(3, '0')} / 100                        ║
║  PORT: ${PORT}                              ║
║  MODE: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}                      ║
╚══════════════════════════════════════════╝
  `)
})
