// 同实例内存计数（Vercel Serverless 实例回收后会重置，但同一会话内有效）
const voteCounts = {}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'POST') {
    const { choice_id } = req.body || {}
    if (!choice_id) return res.status(400).json({ error: '无效选择' })
    voteCounts[choice_id] = (voteCounts[choice_id] || 0) + 1
    return res.status(200).json({ status: 'RECORDED', choice_id, votes: voteCounts[choice_id] })
  }

  return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
}
