import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Confessional() {
  const [confession, setConfession] = useState('')
  const [hasAuthority, setHasAuthority] = useState(false)
  const [wallItems, setWallItems] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [clock, setClock] = useState('')

  // 获取本地日期字符串（避免 UTC 时区 bug）
  const getLocalDate = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  // 实时时钟
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(now.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }))
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  // 检查今日权限
  useEffect(() => {
    const today = getLocalDate()
    const authorityDate = localStorage.getItem('has_authority_date')
    if (authorityDate === today) {
      setHasAuthority(true)
      loadWall()
    }
  }, [])

  const loadWall = async () => {
    try {
      const res = await fetch('/api/confessions?random=5')
      const data = await res.json()
      setWallItems(data.confessions || [])
    } catch {
      // 种子告解数据
      const seeds = [
        '我花了三小时盯着墙壁上的裂缝，想象那是一扇门。没有人会打开它，但光是想象那个可能性，就够我撑过今晚。',
        '今天第一次没有化妆出门。地铁上没有人看我。我突然意识到，我以前害怕的不是"被看"，而是"不被看见"。',
        '我对着冰箱里的过期牛奶说了声对不起，然后把它扔了。我不知道我在道歉什么。',
        '删掉了所有社交软件。三小时后重新下载。这种反复让我觉得自己像一个坏掉的开关。',
        '在超市里突然忘记了自己要买什么，然后什么也没买就走了。收银员看我的眼神好像在说：你确定你没事吗？',
        '凌晨三点对着空荡荡的房间说了声"你好"。没有人回应。但我突然觉得，沉默也是一种回答。',
        '今天没有看手机地坐了一整趟地铁。发现窗外的广告牌换了好几轮了，我之前从来没注意过。',
        '拒绝了三次聚会邀请，不是因为不想去，而是因为我已经忘了怎么在人群里假装开心。',
        '把手机调成灰度模式后，世界突然变得无聊了很多。然后我意识到，我可能也对色彩上瘾了。',
        '在深夜给一个再也不会回复的人发了消息。不是因为期待回应，只是想让对话框里多一条我发的内容。',
      ]
      const shuffled = seeds.sort(() => Math.random() - 0.5).slice(0, 5)
      setWallItems(shuffled.map((content, i) => ({
        id: Date.now() + i,
        content,
        time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
      })))
    }
  }

  const handleSubmit = async () => {
    if (confession.trim().length < 30) return
    setSubmitting(true)
    try {
      await fetch('/api/confessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: confession.trim() })
      })
    } catch { /* 静默 */ }

    const today = getLocalDate()
    localStorage.setItem('has_authority_date', today)
    localStorage.setItem('my_last_confession', confession.trim())
    setHasAuthority(true)
    setSubmitted(true)
    setSubmitting(false)
    loadWall()
  }

  return (
    <div className="min-h-screen bg-monitorBg text-textWhite font-terminal relative overflow-hidden">
      {/* 噪点 */}
      <div className="monitor-grain" />

      {/* 顶部状态栏 */}
      <header className="p-3 md:p-4 border-b border-phosphorGreen/30 flex flex-wrap justify-between items-center font-pixel text-[7px] md:text-[8px] text-phosphorGreen gap-2">
        <div>SYS: ACTIVE // DARKROOM</div>
        <div className="flex items-center gap-2">
          <span className="text-alertRed rec-pulse">●</span>
          <span className="text-alertRed">REC</span>
        </div>
        <div className="tabular-nums">{clock}</div>
      </header>

      <main className="max-w-3xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
        {/* 导航 */}
        <div className="flex items-center gap-4 font-pixel text-[7px] text-phosphorGreen/40">
          <Link to="/monitor" className="hover:text-phosphorGreen transition-colors">← 监视器</Link>
          <span className="tracking-[0.2em] uppercase">// The Darkroom //</span>
        </div>

        {/* 规则说明 */}
        <div className="border border-phosphorGreen/20 bg-monitorGlass/30 p-3 md:p-4 rounded space-y-2">
          <div className="font-pixel text-[8px] text-phosphorGreen uppercase tracking-[0.2em]">// 等价交换法则 //</div>
          <p className="text-sm md:text-base text-textWhite/50 leading-relaxed">
            你想要查看他人的现实反馈，或为明日的禁令投票？你必须先交出自己的秘密。
            没有筹码，就没有窥视的权力。你的告解不少于 30 字，以示诚意。
          </p>
        </div>

        {/* 告解输入区 */}
        {!hasAuthority ? (
          <div className="border border-phosphorGreen/30 bg-monitorGlass/50 p-4 md:p-5 rounded space-y-4">
            <div className="font-pixel text-[8px] text-phosphorGreen/40 tracking-widest">[ 交出你的秘密 ]</div>
            <textarea
              value={confession}
              onChange={e => setConfession(e.target.value)}
              placeholder="在这里写下你今天被剥去的、或主动交出的东西。不要低于 30 字——你的痛苦或渴望，需要更具体的陈述。"
              className="w-full h-32 md:h-36 bg-monitorBg border border-phosphorGreen/20 rounded p-3 text-base text-textWhite/80
                         placeholder:text-phosphorGreen/20 placeholder:font-terminal focus:outline-none focus:border-phosphorGreen/50
                         transition-colors resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="font-pixel text-[7px] text-phosphorGreen/30">
                {confession.trim().length < 30
                  ? `筹码不足 · 还需 ${30 - confession.trim().length} 字`
                  : '筹码充足 · 可以提交'}
              </div>
              <button
                onClick={handleSubmit}
                disabled={confession.trim().length < 30 || submitting}
                className={`font-pixel text-[8px] px-5 py-2 tracking-[0.2em] uppercase border rounded transition-all duration-300
                  ${confession.trim().length >= 30
                    ? 'border-phosphorGreen/50 text-phosphorGreen hover:bg-phosphorGreen/10'
                    : 'border-phosphorGreen/10 text-phosphorGreen/20 cursor-not-allowed'}`}
              >
                {submitting ? '提交中...' : '等价交换'}
              </button>
            </div>
            {/* 字数进度条 */}
            <div className="w-full h-[2px] bg-phosphorGreen/10 rounded">
              <div 
                className={`h-full rounded transition-all duration-300 ${confession.trim().length >= 30 ? 'bg-phosphorGreen/50' : 'bg-phosphorGreen/20'}`}
                style={{ width: `${Math.min((confession.trim().length / 30) * 100, 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="border border-phosphorGreen/20 bg-monitorGlass/30 p-3 md:p-4 rounded">
            {submitted ? (
              <div className="font-pixel text-[8px] text-phosphorGreen/60 text-center py-2">
                [ 秘密已上交 · 窥视权已激活 ]
              </div>
            ) : (
              <div className="font-pixel text-[8px] text-phosphorGreen/60 text-center py-2">
                [ 今日窥视权已激活 ]
              </div>
            )}
          </div>
        )}

        {/* 告解墙 - 暗房显影效果 */}
        {hasAuthority && (
          <div className="space-y-3">
            <div className="font-pixel text-[7px] text-phosphorGreen/40 tracking-widest uppercase">// 他人告解 · 随机抽样 //</div>

            {wallItems.map((item, idx) => (
              <div
                key={item.id}
                className="border border-phosphorGreen/15 bg-monitorGlass/30 p-3 md:p-4 rounded darkroom-reveal"
                style={{ animationDelay: `${idx * 0.8}s` }}
              >
                <p className="text-sm md:text-base text-textWhite/70 leading-relaxed indent-6">
                  {item.content}
                </p>
                <div className="mt-3 flex justify-between font-pixel text-[7px] text-phosphorGreen/20">
                  <span>ANON_#{String(typeof item.id === 'number' ? item.id : idx + 1).padStart(4, '0')}</span>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}

            {wallItems.length === 0 && (
              <div className="font-pixel text-[8px] text-phosphorGreen/20 text-center py-8">
                [ 暂无告解记录 ]
              </div>
            )}
          </div>
        )}

        {/* 自己的最后一条告解 */}
        {localStorage.getItem('my_last_confession') && (
          <div className="border border-alertRed/20 bg-monitorGlass/30 p-3 md:p-4 rounded space-y-2">
            <div className="font-pixel text-[7px] text-alertRed/40 tracking-widest uppercase">// 你最后的告解 //</div>
            <p className="text-sm text-textWhite/40 leading-relaxed italic">
              "{localStorage.getItem('my_last_confession')}"
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
