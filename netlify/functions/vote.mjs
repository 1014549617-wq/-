// ============================================
//  DEPRIVATION PROJECT · VOTE API
//  Netlify Function: /api/vote
//  Writes real votes to Netlify Blobs
// ============================================

import { getStore } from "@netlify/blobs"

function getCurrentDay() {
  const start = new Date('2026-06-02T00:00:00+08:00')
  const now = new Date()
  return Math.min(Math.max(1, Math.floor((now - start) / 86400000) + 1), 100)
}

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

    const currentDay = getCurrentDay()
    let blobsAvailable = false
    let updatedVotes = {}

    try {
      const store = getStore("deprivation", { consistency: "strong" })

      // 读取当天现有票数
      const votesData = await store.get(`votes_day_${currentDay}`, { type: "json", consistency: "strong" }) || {}

      // 给选中的物品 +1
      votesData[choice_id] = (votesData[choice_id] || 0) + 1

      // 写回 Blobs
      await store.setJSON(`votes_day_${currentDay}`, votesData)

      updatedVotes = votesData
      blobsAvailable = true
    } catch (e) {
      // Blobs 不可用 — 投票仍然被"接受"（前端本地会加1）
    }

    return new Response(JSON.stringify({
      status: 'RECORDED',
      choice_id,
      day: currentDay,
      blobs_available: blobsAvailable,
      updated_votes: blobsAvailable ? updatedVotes : undefined
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
  path: "/api/vote"
}
