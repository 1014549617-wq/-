const items = [
  { id: 1, name: "等身穿衣镜", slug: "mirror", action_title: "剥夺粉饰（Denial of Mask）", action_command: "今天，当你面对现实中的镜子时，必须强迫自己停下，无表情凝视自己的眼睛 3 分钟。今日现实禁令：禁止使用任何相机滤镜、彩妆或遮瑕产品。带着你最赤裸、最疲惫的真实面孔走出家门。体会失去面具庇护时的局促，以及午后突然降临的放弃挣扎的解脱。", category: "Psychological" },
  { id: 2, name: "一根静止的麻绳", slug: "rope", action_title: "空间禁闭（Spatial Captivity）", action_command: "今晚回到居所后，在房间里选择一个 1 平米见方的绝对角落。用你的想象或两件衣物划定边界。今晚 21:00 至 22:00，你必须在这一平米内静坐或站立。禁止看手机，禁止离开边界。当你被剥夺了向外探索的空间权力，你的思维将完成一次彻底的断舍离与向内流淌。", category: "Physical" },
  { id: 3, name: "一杯纯净水", slug: "water", action_title: "延迟驯化（Delayed Gratification）", action_command: "今天，你对现实中产生的所有即时欲望（喝水、点外卖、打开社交软件、或是生理宣泄）开启 15 分钟的'绝对延迟期'。当欲望升起时，看一眼时钟，倒计时 15 分钟。在这 15 分钟内保持忍耐，去凝视欲望如何在身体里膨胀、焦灼，以及最终平息的战栗过程。你才是欲望的掌控者。", category: "Physiological" },
  { id: 4, name: "一部已关机的手机", slug: "phone", action_title: "断联剥夺（Connectivity Severance）", action_command: "今日 09:00 至 21:00，你必须将手机完全关机。不是静音，不是飞行模式——是关机。在这 12 小时内，你将失去所有实时通讯、信息流和社交确认。你将直面一种久违的恐惧：与自己独处。注意观察，第几个小时开始，你不再下意识地去摸口袋？", category: "Psychological" },
  { id: 5, name: "一扇朝北的窄窗", slug: "window", action_title: "视野禁闭（Visual Confinement）", action_command: "今天，每当你想要看向窗外——无论是办公室、家里还是路上——你必须强迫自己转回头。在 24 小时内，禁止任何形式的远眺。你的视线不得超过 3 米。你会发现，失去远方后，近处的一切突然变得无比清晰——桌面上的灰尘、指甲边缘的细纹、你一直在逃避的细节。", category: "Physical" },
  { id: 6, name: "一截燃烧过半的蜡烛", slug: "candle", action_title: "时间剥夺（Temporal Diminishment）", action_command: "今晚 22:00，在你的房间里点燃一支蜡烛，然后关闭所有灯光和电子屏幕。你只能借助这根蜡烛的光芒活动。当蜡烛燃尽，你必须在绝对的黑暗中入睡。不允许查看时间。你的时间感将被彻底剥夺——你不知道过了多久，不知道还剩多少。在蜡烛熄灭的那一瞬间，凝视黑暗降临的速度。", category: "Sensory" },
  { id: 7, name: "一双不合脚的鞋", slug: "shoes", action_title: "舒适剥夺（Comfort Denial）", action_command: "今天出门时，穿上你能找到的最不舒服的鞋——太紧、太松、磨脚都可以。走完一整天。不允许换鞋，不允许坐下超过 10 分钟。当你的每一步都伴随着真实的疼痛，你会开始理解：舒适从来不是理所当然的，它是一种你早已忘记感恩的特权。", category: "Physical" },
  { id: 8, name: "一面白墙", slug: "wall", action_title: "言语剥夺（Verbal Nullification）", action_command: "今日 08:00 至 20:00，禁止你主动发起任何对话。你只能回应——且每次回应不得超过 10 个字。当你失去了主动表达的权利，你会听到这个世界远比你以为的更吵闹。而在沉默中，你将发现那些你平时脱口而出的话里，有多少是真正的必要。", category: "Psychological" },
  { id: 9, name: "一个空碗", slug: "bowl", action_title: "味觉剥夺（Taste Erasure）", action_command: "今天的三餐，不允许添加任何调味料——无盐、无糖、无酱、无醋。食物必须以它最原始的状态入口。白水煮蔬菜、无盐米饭、无任何佐料的面包。当味蕾被剥夺了刺激，你会发现食物本身的味道：大米的微甜、蔬菜的青涩、面包的酵母气息。你一直用调味料掩盖了什么？", category: "Physiological" },
  { id: 10, name: "一条死胡同", slug: "deadend", action_title: "选择剥夺（Choice Eradication）", action_command: "今天，当你在任何场景下需要做选择时（吃什么、走哪条路、看什么节目），你必须选择最后一个选项，或者选择你最不想选的那个。剥夺你的选择权 24 小时。你会感受到一种奇异的轻松——当选择消失，焦虑也随之消散。自由，有时候是一种负担。", category: "Psychological" }
]

const confessions = [
  { id: 1, content: '我花了三小时盯着墙壁上的裂缝，想象那是一扇门。打开它之后是什么？我不知道。但光是想象，就让那三个小时变得可以忍受。', time: '03:21' },
  { id: 2, content: '我在超市里突然忘记了自己要买什么，然后什么也没买就走了。走到门口才想起来，但已经不想回去了。', time: '14:08' },
  { id: 3, content: '今天第一次没有化妆出门。地铁上没有人看我。我突然意识到，平时那些目光也不是给我的，是给那张画的。', time: '19:45' },
  { id: 4, content: '把手机关了之后，我发现冰箱里的灯是暖的。我站在那里看了很久。', time: '22:31' },
  { id: 5, content: '吃了无盐的饭。米是甜的。活了二十多年第一次知道米是甜的。', time: '12:17' }
]

function getCurrentDay() {
  const start = new Date('2026-06-02T00:00:00+08:00')
  const now = new Date()
  return Math.min(Math.max(1, Math.floor((now - start) / 86400000) + 1), 100)
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const currentDay = getCurrentDay()
  const unlocked = items.slice(0, Math.min(currentDay, items.length))
  const todayAction = items[(currentDay - 1) % items.length]
  const base = ((currentDay - 1) * 3 + 3) % items.length
  const choices = [base % items.length, (base + 1) % items.length, (base + 2) % items.length].map(idx => ({
    id: items[idx].id,
    name: items[idx].name,
    action_title: items[idx].action_title,
    votes: Math.floor(Math.random() * 20) + 3
  }))

  return res.status(200).json({
    current_day: currentDay,
    unlocked_items: unlocked,
    today_action: todayAction,
    today_choices: choices
  })
}
