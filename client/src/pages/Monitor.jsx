import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Monitor() {
  const [currentDay, setCurrentDay] = useState(1)
  const [items, setItems] = useState([])
  const [todayAction, setTodayAction] = useState(null)
  const [choices, setChoices] = useState([])
  const [voted, setVoted] = useState(false)
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

  // 加载全局状态
  useEffect(() => {
    fetch('/api/state')
      .then(r => r.json())
      .then(data => {
        setCurrentDay(data.current_day)
        setItems(data.unlocked_items || [])
        setTodayAction(data.today_action)
        setChoices(data.today_choices || [])
      })
      .catch(() => {
        // fallback 本地数据
        setCurrentDay(1)
        setItems([{ id: 1, name: '等身穿衣镜', slug: 'mirror' }])
        setTodayAction({
          action_title: '剥夺粉饰（Denial of Mask）',
          action_command: '今天，当你面对现实中的镜子时，必须强迫自己停下，无表情凝视自己的眼睛 3 分钟。今日现实禁令：禁止使用任何相机滤镜、彩妆或遮瑕产品。带着你最赤裸、最疲惫的真实面孔走出家门。体会失去面具庇护时的局促，以及午后突然降临的放弃挣扎的解脱。'
        })
        setChoices([
          { id: 4, name: '一部已关机的手机', action_title: '断联剥夺（Connectivity Severance）', votes: 12 },
          { id: 5, name: '一扇朝北的窄窗', action_title: '视野禁闭（Visual Confinement）', votes: 8 },
          { id: 6, name: '一截燃烧过半的蜡烛', action_title: '时间剥夺（Temporal Diminishment）', votes: 15 }
        ])
      })

    // 检查今日是否已投票
    const votedDay = localStorage.getItem('voted_day')
    const today = new Date().toISOString().slice(0, 10)
    if (votedDay === today) setVoted(true)
  }, [])

  const handleVote = async (choiceId) => {
    if (voted) return
    try {
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice_id: choiceId })
      })
    } catch (e) { /* 静默 */ }
    setVoted(true)
    const today = new Date().toISOString().slice(0, 10)
    localStorage.setItem('voted_day', today)
  }

  // SVG 物品渲染
  const itemSVGs = {
    mirror: (
      <svg viewBox="0 0 80 160" className="h-36 brightness-75 contrast-125" fill="none" stroke="#4a6b52" strokeWidth="1.5">
        <ellipse cx="40" cy="70" rx="30" ry="55" />
        <rect x="35" y="125" width="10" height="30" rx="2" />
        <line x1="15" y1="70" x2="65" y2="70" strokeWidth="0.5" opacity="0.3" />
        <line x1="40" y1="20" x2="40" y2="120" strokeWidth="0.5" opacity="0.3" />
      </svg>
    ),
    rope: (
      <svg viewBox="0 0 40 160" className="h-36 brightness-75 contrast-125" fill="none" stroke="#4a6b52" strokeWidth="2">
        <path d="M20 10 C25 30, 15 50, 20 70 C25 90, 15 110, 20 130 C25 145, 20 155, 20 160" />
        <circle cx="20" cy="8" r="5" strokeWidth="1.5" />
      </svg>
    ),
    water: (
      <svg viewBox="0 0 60 120" className="h-36 brightness-75 contrast-125" fill="none" stroke="#4a6b52" strokeWidth="1.5">
        <path d="M10 50 L10 100 Q10 110 20 110 L40 110 Q50 110 50 100 L50 50" />
        <path d="M15 50 Q30 35 45 50" />
        <ellipse cx="30" cy="80" rx="8" ry="4" strokeWidth="0.8" opacity="0.4" />
        <ellipse cx="30" cy="70" rx="5" ry="2.5" strokeWidth="0.6" opacity="0.3" />
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 50 90" className="h-28 brightness-75 contrast-125" fill="none" stroke="#4a6b52" strokeWidth="1.5">
        <rect x="8" y="5" width="34" height="80" rx="4" />
        <line x1="8" y1="18" x2="42" y2="18" strokeWidth="0.8" opacity="0.4" />
        <circle cx="25" cy="78" r="3" strokeWidth="1" />
        <rect x="12" y="22" width="26" height="48" rx="1" strokeWidth="0.5" opacity="0.3" />
      </svg>
    ),
    window: (
      <svg viewBox="0 0 100 120" className="h-32 brightness-75 contrast-125" fill="none" stroke="#4a6b52" strokeWidth="1.5">
        <rect x="10" y="10" width="80" height="100" rx="2" />
        <line x1="50" y1="10" x2="50" y2="110" />
        <line x1="10" y1="55" x2="90" y2="55" />
        <line x1="25" y1="20" x2="25" y2="48" strokeWidth="0.5" opacity="0.2" />
        <line x1="35" y1="20" x2="35" y2="48" strokeWidth="0.5" opacity="0.15" />
      </svg>
    ),
    candle: (
      <svg viewBox="0 0 50 120" className="h-32 brightness-75 contrast-125" fill="none" stroke="#4a6b52" strokeWidth="1.5">
        <rect x="15" y="50" width="20" height="60" rx="2" />
        <line x1="25" y1="50" x2="25" y2="25" strokeWidth="1" />
        <ellipse cx="25" cy="20" rx="6" ry="10" strokeWidth="1" opacity="0.6" />
        <ellipse cx="25" cy="18" rx="3" ry="6" fill="#4a6b52" opacity="0.15" />
        <line x1="20" y1="80" x2="20" y2="110" strokeWidth="0.5" opacity="0.2" />
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-monitorBg text-textWhite font-mono relative overflow-hidden">
      {/* 噪点 */}
      <div className="monitor-grain" />

      {/* 顶部状态栏 */}
      <header className="p-4 border-b border-phosphorGreen/30 flex flex-wrap justify-between items-center text-xs text-phosphorGreen gap-2">
        <div className="truncate">SYS_STATUS: ACTIVE // CAM-01 (ROOM_DEPRIVATION)</div>
        <div className="flex items-center gap-2">
          <span className="text-alertRed rec-pulse">●</span>
          <span className="text-alertRed">REC</span>
        </div>
        <div id="live-clock" className="tabular-nums">{clock}</div>
      </header>

      {/* 主内容 */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* 核心监控视窗 */}
        <div id="monitor-view" className="scanlines w-full h-72 md:h-80 bg-monitorGlass border border-phosphorGreen/50 rounded relative flex items-center justify-center">
          {/* 物品图层 */}
          <div id="items-layer" className="absolute inset-0 opacity-60 flex items-end justify-center gap-8 pb-8 flex-wrap">
            {items.map((item, idx) => (
              <div key={item.id} className="flex flex-col items-center gap-1 fade-in-up" style={{ animationDelay: `${idx * 0.3}s` }}>
                {itemSVGs[item.slug] || (
                  <div className="w-12 h-12 border border-phosphorGreen/30 rounded flex items-center justify-center text-[8px] text-phosphorGreen/40">
                    {item.slug?.slice(0, 3).toUpperCase()}
                  </div>
                )}
                <span className="text-[9px] text-phosphorGreen/30">{item.name}</span>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-phosphorGreen/20 text-xs">[ 房间为空 · 等待第一件物品坠入 ]</div>
            )}
          </div>

          {/* 悬浮指示 */}
          <div className="absolute top-3 right-4 text-[10px] text-phosphorGreen/40">
            SYSTEM_LOG: DAY_{String(currentDay).padStart(3, '0')}
          </div>
          <div className="absolute bottom-3 left-4 text-[9px] text-phosphorGreen/20">
            ITEMS_IN_ROOM: {items.length}
          </div>
        </div>

        {/* 今日现实行动契约面板 */}
        <section className="border border-phosphorGreen/30 bg-monitorGlass/50 p-5 md:p-6 space-y-4 rounded">
          <div className="text-[10px] text-phosphorGreen uppercase tracking-[0.3em]">// 今日现实指令 //</div>
          {todayAction ? (
            <>
              <h2 className="text-lg md:text-xl font-bold text-textWhite">{todayAction.action_title}</h2>
              <p className="text-sm text-textWhite/80 leading-relaxed indent-8">
                {todayAction.action_command}
              </p>
            </>
          ) : (
            <div className="text-phosphorGreen/30 text-sm">[ 等待指令加载... ]</div>
          )}
        </section>

        {/* 明日投票区 */}
        <section className="border border-phosphorGreen/30 bg-monitorGlass/50 p-5 md:p-6 space-y-4 rounded">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-phosphorGreen uppercase tracking-[0.3em]">// 明日博弈 · 三选一 //</div>
            <Link to="/confessional" className="text-[10px] text-phosphorGreen/50 hover:text-phosphorGreen transition-colors">
              告解室 →
            </Link>
          </div>

          {voted ? (
            <div className="text-xs text-phosphorGreen/60 py-4 text-center">
              [ 今日投票已提交 · 等待 00:00 结算 ]
            </div>
          ) : (
            <div className="space-y-3">
              {choices.map((choice, idx) => (
                <button
                  key={choice.id}
                  onClick={() => handleVote(choice.id)}
                  className="w-full text-left border border-phosphorGreen/20 hover:border-phosphorGreen/60 bg-monitorGlass/30
                             p-4 rounded transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[10px] text-phosphorGreen/40 mb-1">物品 {idx + 1}</div>
                      <div className="text-sm text-textWhite group-hover:text-phosphorGreen transition-colors">
                        {choice.name}
                      </div>
                      <div className="text-xs text-textWhite/50 mt-1">
                        {choice.action_title}
                      </div>
                    </div>
                    <div className="text-[10px] text-phosphorGreen/20 shrink-0">
                      {choice.votes || 0} 票
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
