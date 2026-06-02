// ============================================
//  DEPRIVATION PROJECT · VOTE API
//  Netlify Function: /api/vote
// ============================================

// 同实例内存计数
const voteCounts = {}

export default async (req) => {
  // CORS
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

    voteCounts[choice_id] = (voteCounts[choice_id] || 0) + 1
    return new Response(JSON.stringify({ status: 'RECORDED', choice_id, votes: voteCounts[choice_id] }), {
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
