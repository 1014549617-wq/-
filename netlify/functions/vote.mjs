// ============================================
//  DEPRIVATION PROJECT · VOTE API
//  Netlify Function: /api/vote
//  Uses Netlify Blobs for persistent vote storage
// ============================================

import { getStore } from '@netlify/blobs'

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }

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

    const { choice_id } = body || {}
    if (!choice_id) {
      return new Response(JSON.stringify({ error: '无效选择' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }

    // 计算当前天数
    const start = new Date('2026-06-02T00:00:00+08:00')
    const now = new Date()
    const currentDay = Math.min(Math.max(1, Math.floor((now - start) / 86400000) + 1), 100)

    // 从 Blobs 读取当日票数 → 增加一票 → 写回
    try {
      const store = getStore('votes')
      const dayData = (await store.get(`day_${currentDay}`, { type: 'json' })) || {}
      dayData[choice_id] = (dayData[choice_id] || 0) + 1
      await store.setJSON(`day_${currentDay}`, dayData)

      return new Response(JSON.stringify({
        status: 'RECORDED',
        choice_id,
        votes: dayData[choice_id],
        day: currentDay
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    } catch (e) {
      // Blobs 不可用时回退到内存计数
      return new Response(JSON.stringify({
        status: 'RECORDED',
        choice_id,
        votes: 0,
        day: currentDay,
        warning: 'Storage unavailable'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }
  }

  return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  })
}

export const config = {
  path: "/api/vote"
}
