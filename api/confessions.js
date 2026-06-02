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
  // ——— 更深层的秘密 ———
  { id: 11, content: '洗澡的时候故意用很烫的水。不是因为舒服，是因为只有痛觉能让我确认自己还在这个身体里。水温降下来的时候我才能正常呼吸，那几秒钟的清醒比一整天都真实。', time: '23:47' },
  { id: 12, content: '我在公司的洗手间里哭过。不止一次。每次都是打开水龙头，让水流声盖住所有动静。然后补妆，回工位，像什么都没发生。最可怕的是我已经越来越擅长这个流程了。', time: '14:22' },
  { id: 13, content: '分手三年了，我每个月还是会翻一次她的朋友圈。不是为了怀念，是为了确认她过得比我好。因为如果她也不好，我这些年受的苦就真的毫无意义了。', time: '02:15' },
  { id: 14, content: '我从来不让别人来我家。不是因为乱，是因为这里是我唯一能卸下一切的地方。如果有人看到了我独处时的样子，那我就真的无处可藏了。', time: '21:33' },
  { id: 15, content: '失眠的夜晚我会数自己搞砸的关系。朋友、恋人、家人。数到第十七条的时候我停了，不是因为数完了，是因为我开始分不清哪些是他们的错哪些是我的错。', time: '04:08' },
  { id: 16, content: '我把所有聊天记录都备份了。从 2018 年至今。有时候深夜会搜索"对不起"和"我错了"，看看这些年我对谁说过最多这两个词。结果发现，对自己说得最多。', time: '03:55' },
  { id: 17, content: '有一阵子我每天故意走不同的路回家，因为我害怕固定的路线会让我觉得人生也是固定的。后来发现，不管走哪条路，回到的都是同一个空房间。', time: '19:40' },
  { id: 18, content: '我把闹钟设成比需要的时间早四十分钟。不是为了多睡那四十分钟，是为了在那四十分钟里享受"还可以再赖一会"的错觉。那是我一天里唯一觉得自己有选择权的时刻。', time: '06:10' },
  { id: 19, content: '有人问我还好吗，我说还好。有人说想我了，我说我也是。有人夸我坚强，我笑了笑。全是假的。但假久了以后我分不清哪次是真的哪次是假的了，连对自己我都开始说谎。', time: '17:28' },
  { id: 20, content: '我有一种说不出口的恐惧：害怕如果我不再伪装了，身边所有人都会离开。所以我把最真实的话写在这里——给一群永远不会知道我是谁的人。匿名是我唯一的安全感。', time: '00:03' },
  { id: 21, content: '今天把手机关了整整八小时。重新开机后有 47 条未读消息，没有一条是我期待的人发的。那一刻我意识到，我害怕的不是孤独，是发现自己其实一直都是孤独的。', time: '20:55' },
  { id: 22, content: '每周末我都会去同一家咖啡馆坐两个小时。不带电脑不看手机。什么都不做。有人问我为什么，我说喜欢那里的咖啡。其实我只是需要确认世界上有一个地方，我去了不会被打扰。', time: '15:17' },
  { id: 23, content: '我在备忘录里写了一封永远不会寄出的信。写给十年前的自己。只有三行字：别怕。不是你的错。你比你以为的更接近被原谅。写了删、删了写，反复了三个月才定稿。但那封信只属于备忘录。', time: '01:44' },
  { id: 24, content: '做梦的时候我总是在跑。不是被追，是朝着某个看不见的东西跑。醒来后心跳很快。我怀疑我在梦里比在现实里更诚实——至少在梦里我知道自己在逃。', time: '05:32' },
  { id: 25, content: '我把微信里那些"最近怎么样"的对话框全都标为已读但不回。不是因为不想聊，是因为我知道一旦聊起来，我就又要扮演那个"我还好"的人。演了二十多年了，真的很累。', time: '22:41' },
]

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    const count = parseInt(req.query?.random) || 8
    const shuffled = [...confessions].sort(() => Math.random() - 0.5)
    return res.status(200).json({ confessions: shuffled.slice(0, Math.min(count, 8)) })
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
    return res.status(200).json({ confessions: shuffled.slice(0, 8) })
  }

  return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
}
