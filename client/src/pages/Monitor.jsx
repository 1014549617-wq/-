import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Monitor() {
  const [currentDay, setCurrentDay] = useState(1)
  const [items, setItems] = useState([])
  const [todayAction, setTodayAction] = useState(null)
  const [choices, setChoices] = useState([])
  const [voted, setVoted] = useState(false)
  const [votedChoice, setVotedChoice] = useState(null)
  const [gazing, setGazing] = useState(false)   // 凝视倒计时中
  const [gazeTarget, setGazeTarget] = useState(null)  // 凝视目标ID
  const [gazeTimer, setGazeTimer] = useState(5)
  const [clock, setClock] = useState('')
  const [showGlitch, setShowGlitch] = useState(false)

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

    const votedDay = localStorage.getItem('voted_day')
    const today = new Date().toISOString().slice(0, 10)
    if (votedDay === today) {
      setVoted(true)
      setVotedChoice(parseInt(localStorage.getItem('voted_choice') || '0'))
    }
  }, [])

  // 凝视倒计时
  useEffect(() => {
    if (!gazing) return
    if (gazeTimer <= 0) {
      // 凝视完成，执行投票
      executeVote(gazeTarget)
      return
    }
    const t = setTimeout(() => setGazeTimer(g => g - 1), 1000)
    return () => clearTimeout(t)
  }, [gazing, gazeTimer])

  const startGaze = (choiceId) => {
    if (voted || gazing) return
    setGazeTarget(choiceId)
    setGazing(true)
    setGazeTimer(5)
  }

  const cancelGaze = () => {
    setGazing(false)
    setGazeTarget(null)
    setGazeTimer(5)
  }

  const executeVote = async (choiceId) => {
    try {
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice_id: choiceId })
      })
    } catch (e) { /* 静默 */ }
    setVoted(true)
    setVotedChoice(choiceId)
    setGazing(false)
    const today = new Date().toISOString().slice(0, 10)
    localStorage.setItem('voted_day', today)
    localStorage.setItem('voted_choice', String(choiceId))
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

  // 昨日执行报告（模拟数据）
  const yesterdayReport = currentDay > 1 ? {
    total_votes: 127,
    winning_item: choices.length > 0 ? choices[0].name : '一部已关机的手机',
    execution_rate: 73,
    confessions_count: 42
  } : null

  return (
    <div className="min-h-screen bg-monitorBg text-textWhite font-terminal relative overflow-hidden">
      {/* 噪点 */}
      <div className="monitor-grain" />

      {/* 信号中断转场 */}
      {showGlitch && <div className="signal-cut"><div className="signal-noise" /></div>}

      {/* 顶部状态栏 */}
      <header className="p-3 md:p-4 border-b border-phosphorGreen/30 flex flex-wrap justify-between items-center font-pixel text-[7px] md:text-[8px] text-phosphorGreen gap-2">
        <div className="truncate">SYS: ACTIVE // CAM-01</div>
        <div className="flex items-center gap-2">
          <span className="text-alertRed rec-pulse">●</span>
          <span className="text-alertRed">REC</span>
        </div>
        <div className="tabular-nums">{clock}</div>
      </header>

      {/* 100天进度红线 */}
      <div className="w-full h-[2px] bg-monitorGlass relative">
        <div 
          className="absolute left-0 top-0 h-full bg-alertRed/60 transition-all duration-1000"
          style={{ width: `${(currentDay / 100) * 100}%` }}
        />
      </div>

      {/* 主内容 */}
      <main className="max-w-4xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
        {/* 核心监控视窗 */}
        <div id="monitor-view" className="scanlines w-full h-56 md:h-80 bg-monitorGlass border border-phosphorGreen/50 rounded relative flex items-center justify-center overflow-hidden">
          {/* 物品图层 */}
          <div id="items-layer" className="absolute inset-0 opacity-60 flex items-end justify-center gap-4 md:gap-8 pb-6 md:pb-8 flex-wrap px-2">
            {items.map((item, idx) => (
              <div key={item.id} className="flex flex-col items-center gap-1 fade-in-up" style={{ animationDelay: `${idx * 0.3}s` }}>
                {itemSVGs[item.slug] || (
                  <div className="w-10 h-10 md:w-12 md:h-12 border border-phosphorGreen/30 rounded flex items-center justify-center font-pixel text-[6px] md:text-[7px] text-phosphorGreen/40">
                    {item.slug?.slice(0, 3).toUpperCase()}
                  </div>
                )}
                <span className="font-pixel text-[6px] md:text-[7px] text-phosphorGreen/30">{item.name}</span>
              </div>
            ))}
            {items.length === 0 && (
              <div className="font-pixel text-[8px] text-phosphorGreen/20">[ 房间为空 · 等待第一件物品坠入 ]</div>
            )}
          </div>

          {/* 悬浮指示 */}
          <div className="absolute top-2 md:top-3 right-3 md:right-4 font-pixel text-[6px] md:text-[7px] text-phosphorGreen/40">
            DAY_{String(currentDay).padStart(3, '0')}
          </div>
          <div className="absolute bottom-2 md:bottom-3 left-3 md:left-4 font-pixel text-[6px] md:text-[7px] text-phosphorGreen/20">
            ITEMS: {items.length}
          </div>
          <div className="absolute bottom-2 md:bottom-3 right-3 md:right-4 font-pixel text-[6px] md:text-[7px] text-phosphorGreen/15">
            REC {clock}
          </div>
        </div>

        {/* 昨日执行报告 */}
        {yesterdayReport && (
          <section className="border border-alertRed/20 bg-monitorGlass/30 p-3 md:p-4 rounded">
            <div className="font-pixel text-[7px] text-alertRed/50 uppercase tracking-[0.2em] mb-3">// 昨日执行报告 //</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <div className="font-pixel text-[6px] text-phosphorGreen/30 mb-1">总投票数</div>
                <div className="font-pixel text-sm md:text-base text-textWhite/70">{yesterdayReport.total_votes}</div>
              </div>
              <div>
                <div className="font-pixel text-[6px] text-phosphorGreen/30 mb-1">坠入物品</div>
                <div className="font-pixel text-[8px] md:text-[10px] text-textWhite/70 leading-relaxed">{yesterdayReport.winning_item}</div>
              </div>
              <div>
                <div className="font-pixel text-[6px] text-phosphorGreen/30 mb-1">执行率</div>
                <div className="font-pixel text-sm md:text-base text-alertRed/70">{yesterdayReport.execution_rate}%</div>
              </div>
              <div>
                <div className="font-pixel text-[6px] text-phosphorGreen/30 mb-1">告解数</div>
                <div className="font-pixel text-sm md:text-base text-textWhite/70">{yesterdayReport.confessions_count}</div>
              </div>
            </div>
          </section>
        )}

        {/* 今日现实行动契约面板 */}
        <section className="border border-phosphorGreen/30 bg-monitorGlass/50 p-4 md:p-6 space-y-3 md:space-y-4 rounded">
          <div className="font-pixel text-[8px] text-phosphorGreen uppercase tracking-[0.2em]">// 今日现实指令 //</div>
          {todayAction ? (
            <>
              <h2 className="font-pixel text-xs md:text-sm text-textWhite leading-relaxed">{todayAction.action_title}</h2>
              <p className="text-base md:text-lg text-textWhite/80 leading-relaxed indent-8">
                {todayAction.action_command}
              </p>
            </>
          ) : (
            <div className="font-pixel text-[8px] text-phosphorGreen/30">[ 等待指令加载... ]</div>
          )}
        </section>

        {/* 明日投票区 */}
        <section className="border border-phosphorGreen/30 bg-monitorGlass/50 p-4 md:p-6 space-y-3 md:space-y-4 rounded">
          <div className="flex items-center justify-between">
            <div className="font-pixel text-[8px] text-phosphorGreen uppercase tracking-[0.2em]">// 明日博弈 · 三选一 //</div>
            <Link to="/confessional" className="font-pixel text-[7px] text-phosphorGreen/50 hover:text-phosphorGreen transition-colors">
              告解室 →
            </Link>
          </div>

          {voted ? (
            <div className="text-center py-4 space-y-2">
              <div className="font-pixel text-[8px] text-phosphorGreen/60">
                [ 今日投票已提交 · 等待 00:00 结算 ]
              </div>
              {/* 烙印：显示你选了什么 */}
              {votedChoice && (
                <div className="inline-flex items-center gap-2 border border-alertRed/30 bg-alertRed/10 px-3 py-1 rounded">
                  <span className="font-pixel text-[7px] text-alertRed/70">◆ 已烙印</span>
                  <span className="font-pixel text-[7px] text-textWhite/40">
                    {choices.find(c => c.id === votedChoice)?.name || '???'}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {choices.map((choice, idx) => {
                const isGazingThis = gazing && gazeTarget === choice.id
                return (
                  <div key={choice.id} className="relative">
                    <button
                      onClick={() => startGaze(choice.id)}
                      disabled={gazing && gazeTarget !== choice.id}
                      className={`w-full text-left border bg-monitorGlass/30 p-3 md:p-4 rounded transition-all duration-300 group
                        ${isGazingThis 
                          ? 'border-alertRed/60 bg-alertRed/5' 
                          : 'border-phosphorGreen/20 hover:border-phosphorGreen/60'}
                        ${gazing && gazeTarget !== choice.id ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-pixel text-[7px] text-phosphorGreen/40 mb-1">物品 {idx + 1}</div>
                          <div className="text-base text-textWhite group-hover:text-phosphorGreen transition-colors">
                            {choice.name}
                          </div>
                          <div className="font-pixel text-[8px] text-textWhite/50 mt-1">
                            {choice.action_title}
                          </div>
                        </div>
                        <div className="font-pixel text-[7px] text-phosphorGreen/20 shrink-0">
                          {choice.votes || 0}票
                        </div>
                      </div>
                    </button>

                    {/* 凝视覆盖层 */}
                    {isGazingThis && (
                      <div className="absolute inset-0 bg-monitorBg/90 rounded flex flex-col items-center justify-center gap-3 z-10"
                           onClick={cancelGaze}>
                        <div className="font-pixel text-[7px] text-phosphorGreen/40 uppercase tracking-widest">
                          凝视以确认 · 不可撤回
                        </div>
                        <div className="relative w-16 h-16">
                          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
                            <circle cx="30" cy="30" r="26" fill="none" stroke="#7f1d1d40" strokeWidth="3" />
                            <circle cx="30" cy="30" r="26" fill="none" stroke="#7f1d1d" strokeWidth="3"
                              strokeDasharray={`${(gazeTimer / 5) * 163.36} 163.36`}
                              className="transition-all duration-1000" />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center font-pixel text-2xl text-alertRed/80">
                            {gazeTimer}
                          </span>
                        </div>
                        <div className="font-pixel text-[6px] text-phosphorGreen/20">
                          点击取消
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
