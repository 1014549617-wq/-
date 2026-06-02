import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Confessional() {
  const [confession, setConfession] = useState('')
  const [hasAuthority, setHasAuthority] = useState(false)
  const [wallItems, setWallItems] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [clock, setClock] = useState('')

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
    const today = new Date().toISOString().slice(0, 10)
    const authorityDate = localStorage.getItem('has_authority_date')
    if (authorityDate === today) {
      setHasAuthority(true)
      loadWall()
    }
  }, [])

  const loadWall = async () => {
    try {
      const res = await fetch('/api/confessions?random=3')
      const data = await res.json()
      setWallItems(data.confessions || [])
    } catch {
      // fallback
      setWallItems([
        { id: 1, content: '我花了三小时盯着墙壁上的裂缝，想象那是一扇门。', time: '03:21' },
        { id: 2, content: '我在超市里突然忘记了自己要买什么，然后什么也没买就走了。', time: '14:08' },
        { id: 3, content: '今天第一次没有化妆出门。地铁上没有人看我。', time: '19:45' }
      ])
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

    const today = new Date().toISOString().slice(0, 10)
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
      <header className="p-4 border-b border-phosphorGreen/30 flex flex-wrap justify-between items-center font-pixel text-[8px] text-phosphorGreen gap-2">
        <div>SYS_STATUS: ACTIVE // DARKROOM</div>
        <div className="flex items-center gap-2">
          <span className="text-alertRed rec-pulse">●</span>
          <span className="text-alertRed">REC</span>
        </div>
        <div className="tabular-nums">{clock}</div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        {/* 导航 */}
        <div className="flex items-center gap-4 font-pixel text-[7px] text-phosphorGreen/40">
          <Link to="/monitor" className="hover:text-phosphorGreen transition-colors">← 监视器</Link>
          <span className="tracking-[0.2em] uppercase">// The Darkroom //</span>
        </div>

        {/* 规则说明 */}
        <div className="border border-phosphorGreen/20 bg-monitorGlass/30 p-4 rounded space-y-2">
          <div className="font-pixel text-[8px] text-phosphorGreen uppercase tracking-[0.2em]">// 等价交换法则 //</div>
          <p className="text-base text-textWhite/50 leading-relaxed">
            你想要查看他人的现实反馈，或为明日的禁令投票？你必须先交出自己的秘密。
            没有筹码，就没有窥视的权力。你的告解不少于 30 字，以示诚意。
          </p>
        </div>

        {/* 告解输入区 */}
        {!hasAuthority ? (
          <div className="border border-phosphorGreen/30 bg-monitorGlass/50 p-5 rounded space-y-4">
            <div className="font-pixel text-[8px] text-phosphorGreen/40 tracking-widest">[ 交出你的秘密 ]</div>
            <textarea
              value={confession}
              onChange={e => setConfession(e.target.value)}
              placeholder="在这里写下你今天被剥去的、或主动交出的东西。不要低于 30 字——你的痛苦或渴望，需要更具体的陈述。"
              className="w-full h-36 bg-monitorBg border border-phosphorGreen/20 rounded p-3 text-base text-textWhite/80
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
                className={`font-pixel text-[8px] px-6 py-2 tracking-[0.2em] uppercase border rounded transition-all duration-300
                  ${confession.trim().length >= 30
                    ? 'border-phosphorGreen/50 text-phosphorGreen hover:bg-phosphorGreen/10'
                    : 'border-phosphorGreen/10 text-phosphorGreen/20 cursor-not-allowed'}`}
              >
                {submitting ? '提交中...' : '等价交换'}
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-phosphorGreen/20 bg-monitorGlass/30 p-4 rounded">
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

        {/* 告解墙 */}
        {hasAuthority && (
          <div className="space-y-3">
            <div className="font-pixel text-[7px] text-phosphorGreen/40 tracking-widest uppercase">// 他人告解 · 随机抽样 //</div>

            {wallItems.map((item, idx) => (
              <div
                key={item.id}
                className="border border-phosphorGreen/15 bg-monitorGlass/30 p-4 rounded fade-in-up"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <p className="text-base text-textWhite/70 leading-relaxed indent-6">
                  {item.content}
                </p>
                <div className="mt-3 flex justify-between font-pixel text-[7px] text-phosphorGreen/20">
                  <span>ANON_#{String(item.id).padStart(4, '0')}</span>
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
          <div className="border border-alertRed/20 bg-monitorGlass/30 p-4 rounded space-y-2">
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
