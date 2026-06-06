// ============================================
//  DEPRIVATION PROJECT · CONFESSIONS API
//  Netlify Function: /api/confessions
//  Only real user submissions via Blobs
// ============================================

import { getStore } from "@netlify/blobs"

// 垃圾内容检测
function isSpam(content) {
  const trimmed = content.trim()
  if (trimmed.length < 10) return true
  // 全是重复字符（如 "11111", "哈哈哈", "aaaa"）
  const uniqueChars = new Set(trimmed.replace(/\s/g, '')).size
  if (uniqueChars <= 3 && trimmed.length > 15) return true
  // 同一个词重复超过5次
  const words = trimmed.split(/\s+/)
  if (words.length > 5) {
    const counts = {}
    for (const w of words) {
      counts[w] = (counts[w] || 0) + 1
      if (counts[w] > 5) return true
    }
  }
  return false
}

// 从 Blobs 加载用户提交的告解
async function loadUserConfessions() {
  let userConfessions = []
  let blobsAvailable = false

  try {
    const store = getStore("deprivation", { consistency: "strong" })
    const raw = await store.get("user_confessions", { type: "json", consistency: "strong" }) || []
    blobsAvailable = true

    // 过滤垃圾内容
    userConfessions = raw.filter(c => !isSpam(c.content))

    // 如果过滤后变少了，把干净的写回 Blobs（自动清理）
    if (userConfessions.length < raw.length) {
      try {
        await store.setJSON("user_confessions", userConfessions)
      } catch { /* 静默 */ }
    }
  } catch {
    userConfessions = []
  }

  return {
    confessions: userConfessions,
    blobsAvailable
  }
}

export default async (req) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }

  // GET: 返回所有真人告解
  if (req.method === 'GET') {
    const { confessions, blobsAvailable } = await loadUserConfessions()
    // 按时间倒序（最新的在前）
    const sorted = [...confessions].sort((a, b) => b.id - a.id)

    return new Response(JSON.stringify({
      confessions: sorted,
      total: sorted.length,
      blobs_available: blobsAvailable
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0'
      }
    })
  }

  // POST: 用户提交告解
  if (req.method === 'POST') {
    let body
    try {
      body = await req.json()
    } catch {
      return new Response(JSON.stringify({ error: '无效请求' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }

    const { content } = body || {}
    if (!content || content.trim().length < 30) {
      return new Response(JSON.stringify({ error: '筹码不足。你的痛苦或渴望，需要更具体的陈述。' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }

    // 垃圾检测
    if (isSpam(content)) {
      return new Response(JSON.stringify({ error: '内容质量不足。请写出更具体的陈述。' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }

    let blobsAvailable = false
    const newConfession = {
      id: Date.now(),
      content: content.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      seed: false
    }

    try {
      const store = getStore("deprivation", { consistency: "strong" })

      // 读取现有用户告解
      const existing = await store.get("user_confessions", { type: "json", consistency: "strong" }) || []

      // 添加新告解（保留最新 200 条）
      existing.push(newConfession)
      if (existing.length > 200) {
        existing.splice(0, existing.length - 200)
      }

      // 写回 Blobs
      await store.setJSON("user_confessions", existing)
      blobsAvailable = true
    } catch {
      // Blobs 不可用
    }

    // 返回更新后的所有真人告解
    const { confessions } = await loadUserConfessions()
    const sorted = [...confessions].sort((a, b) => b.id - a.id)

    return new Response(JSON.stringify({
      confessions: sorted,
      submitted: true,
      total: sorted.length,
      blobs_available: blobsAvailable
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  })
}

export const config = {
  path: "/api/confessions"
}
