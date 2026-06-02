const confessions = [
  { id: 1, content: '我花了三小时盯着墙壁上的裂缝，想象那是一扇门。没有人会打开它，但光是想象那个可能性，就够我撑过今晚。', time: '03:21' },
  { id: 2, content: '今天第一次没有化妆出门。地铁上没有人看我。我突然意识到，我以前害怕的不是"被看"，而是"不被看见"。', time: '07:45' },
  { id: 3, content: '我对着冰箱里的过期牛奶说了声对不起，然后把它扔了。我不知道我在道歉什么。', time: '09:12' },
  { id: 4, content: '删掉了所有社交软件。三小时后重新下载。这种反复让我觉得自己像一个坏掉的开关。', time: '10:33' },
  { id: 5, content: '在超市里突然忘记了自己要买什么，然后什么也没买就走了。收银员看我的眼神好像在说：你确定你没事吗？', time: '14:08' },
  { id: 6, content: '凌晨三点对着空荡荡的房间说了声"你好"。没有人回应。但我突然觉得，沉默也是一种回答。', time: '03:00' },
  { id: 7, content: '今天没有看手机地坐了一整趟地铁。发现窗外的广告牌换了好几轮了，我之前从来没注意过。', time: '08:22' },
  { id: 8, content: '拒绝了三次聚会邀请，不是因为不想去，而是因为我已经忘了怎么在人群里假装开心。', time: '18:47' },
  { id: 9, content: '把手机调成灰度模式后，世界突然变得无聊了很多。然后我意识到，我可能也对色彩上瘾了。', time: '11:05' },
  { id: 10, content: '在深夜给一个再也不会回复的人发了消息。不是因为期待回应，只是想让对话框里多一条我发的内容。', time: '01:38' },
  { id: 11, content: '吃了无盐的饭。米是甜的。活了二十多年第一次知道米是甜的。', time: '12:17' },
  { id: 12, content: '站在十字路口整整五分钟没有动。不是因为不知道往哪走，而是突然觉得哪个方向都一样。', time: '16:30' },
  { id: 13, content: '把衣柜里一半的衣服扔了。看着空了一半的衣柜，我感到的不是可惜，是一种奇怪的轻松。', time: '15:22' },
  { id: 14, content: '今天一天没有照镜子。到了晚上洗脸的时候差点没认出自己。', time: '22:10' },
  { id: 15, content: '关掉手机的那一秒，房间突然变得好安静。然后我听到了自己的心跳，比我想象的要快。', time: '21:00' },
  { id: 16, content: '戴着厚手套打字，每个字母都要按三次才能对。我忽然理解了什么叫"触手可及却遥不可及"。', time: '09:44' },
  { id: 17, content: '绕了一条从来没走过的路回家。发现了一家我住了三年都不知道的旧书店。', time: '18:55' },
  { id: 18, content: '在黑暗中泡了一杯茶，靠触觉找到杯子、茶叶和热水。手比眼睛可靠。', time: '20:15' },
  { id: 19, content: '今天对每个我通常会说"不用了"的提议说了"好"。原来答应一件事情的感觉这么轻。', time: '13:07' },
  { id: 20, content: '不设闹钟睡到自然醒。醒来发现已经十一点了。身体需要的不是七小时，是九小时。', time: '11:03' },
  { id: 21, content: '在超市收银台前，排在我后面的人叹了口气。我回头看她，她笑了笑说"没事"。但那个叹气里有整个宇宙。', time: '16:42' },
  { id: 22, content: '今天走了 18000 步。不是为了锻炼，是因为不想回家。每多走一步，就多一分钟不用面对空房间。', time: '22:18' },
  { id: 23, content: '把微信头像换成了一张全白的图。一个小时内有 7 个人问我怎么了。我什么也没回。', time: '20:55' },
  { id: 24, content: '在便利店买了一瓶水，店员多找了我 5 块钱。我犹豫了三秒，还回去了。回家的路上一直在想那三秒。', time: '19:30' },
  { id: 25, content: '今天第一次一个人去看电影。全程没有人跟我讨论剧情。散场后我坐在座位上没动，因为不想从那个世界回到这个世界。', time: '23:15' },
]

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    const count = parseInt(req.query?.random) || 3
    const shuffled = [...confessions].sort(() => Math.random() - 0.5)
    return res.status(200).json({ confessions: shuffled.slice(0, Math.min(count, 5)) })
  }

  if (req.method === 'POST') {
    const { content } = req.body || {}
    if (!content || content.trim().length < 30) {
      return res.status(400).json({ error: '筹码不足。你的痛苦或渴望，需要更具体的陈述。' })
    }
    confessions.push({
      id: confessions.length + 1,
      content: content.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
    })
    const shuffled = [...confessions].sort(() => Math.random() - 0.5)
    return res.status(200).json({ confessions: shuffled.slice(0, 5) })
  }

  return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
}
