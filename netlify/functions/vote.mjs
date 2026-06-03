// ============================================
//  DEPRIVATION PROJECT · VOTE API
//  Netlify Function: /api/vote
//  Stateless — frontend handles local vote tracking
// ============================================

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

    const start = new Date('2026-06-02T00:00:00+08:00')
    const now = new Date()
    const currentDay = Math.min(Math.max(1, Math.floor((now - start) / 86400000) + 1), 100)

    return new Response(JSON.stringify({
      status: 'RECORDED',
      choice_id,
      day: currentDay
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
