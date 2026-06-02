const confessions = [
  { id: 1, content: '我花了三小时盯着墙壁上的裂缝，想象那是一扇门。打开它之后是什么？我不知道。但光是想象，就让那三个小时变得可以忍受。', time: '03:21' },
  { id: 2, content: '我在超市里突然忘记了自己要买什么，然后什么也没买就走了。走到门口才想起来，但已经不想回去了。', time: '14:08' },
  { id: 3, content: '今天第一次没有化妆出门。地铁上没有人看我。我突然意识到，平时那些目光也不是给我的，是给那张画的。', time: '19:45' },
  { id: 4, content: '把手机关了之后，我发现冰箱里的灯是暖的。我站在那里看了很久。', time: '22:31' },
  { id: 5, content: '吃了无盐的饭。米是甜的。活了二十多年第一次知道米是甜的。', time: '12:17' }
]

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    const shuffled = [...confessions].sort(() => Math.random() - 0.5)
    return res.status(200).json({ confessions: shuffled.slice(0, 3) })
  }

  if (req.method === 'POST') {
    const { content } = req.body || {}
    if (!content || content.trim().length < 30) {
      return res.status(400).json({ error: '筹码不足。你的痛苦或渴望，需要更具体的陈述。' })
    }
    // 在 serverless 环境中，数据不会持久化——但这正好契合项目概念
    confessions.push({
      id: confessions.length + 1,
      content: content.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
    })
    const shuffled = [...confessions].sort(() => Math.random() - 0.5)
    return res.status(200).json({ confessions: shuffled.slice(0, 3) })
  }

  return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
}
