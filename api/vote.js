export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'POST') {
    const { choice_id } = req.body || {}
    if (!choice_id) return res.status(400).json({ error: '无效选择' })
    // Serverless 无持久化，投票结果仅在单次冷启动周期内有效
    return res.status(200).json({ status: 'RECORDED', choice_id })
  }

  return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
}
