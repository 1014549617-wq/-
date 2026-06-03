import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Monitor() {
  const [currentDay, setCurrentDay] = useState(1)
  const [items, setItems] = useState([])
  const [todayAction, setTodayAction] = useState(null)
  const [choices, setChoices] = useState([])
  const [voted, setVoted] = useState(false)
  const [votedChoice, setVotedChoice] = useState(null)
  const [gazing, setGazing] = useState(false)
  const [gazeTarget, setGazeTarget] = useState(null)
  const [gazeTimer, setGazeTimer] = useState(5)
  const [clock, setClock] = useState('')
  const [showGlitch, setShowGlitch] = useState(false)
  const [viewCount, setViewCount] = useState(0)

  // 执行确认
  const [executed, setExecuted] = useState(false)
  const [execGazing, setExecGazing] = useState(false)
  const [execGazeTimer, setExecGazeTimer] = useState(5)

  // 告解室
  const [confession, setConfession] = useState('')
  const [hasAuthority, setHasAuthority] = useState(false)
  const [wallItems, setWallItems] = useState([])
  const [previewItems, setPreviewItems] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // 执行档案
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [executionArchive, setExecutionArchive] = useState([])

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

  // 加载全局状态
  const loadState = () => {
    fetch('/api/state')
      .then(r => r.json())
      .then(data => {
        setCurrentDay(data.current_day)
        setItems(data.unlocked_items || [])
        setTodayAction(data.today_action)
        setChoices(data.today_choices || [])
        setViewCount(data.view_count || 0)
        if (data.yesterday_report) {
          setYesterdayReport(data.yesterday_report)
        }
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
  }

  useEffect(() => {
    loadState()

    // 恢复投票状态
    const votedDay = localStorage.getItem('voted_day')
    const today = getLocalDate()
    if (votedDay === today) {
      setVoted(true)
      setVotedChoice(parseInt(localStorage.getItem('voted_choice') || '0'))
    }

    // 恢复执行确认状态
    const execDay = localStorage.getItem('executed_day')
    if (execDay === today) {
      setExecuted(true)
    }

    // 恢复告解权限
    const authorityDate = localStorage.getItem('has_authority_date')
    if (authorityDate === today) {
      setHasAuthority(true)
    }

    // 加载执行档案
    loadArchive()
  }, [])

  // ============ 投票凝视逻辑 ============
  useEffect(() => {
    if (!gazing) return
    if (gazeTimer <= 0) {
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
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice_id: choiceId })
      })
      const data = await res.json()
      if (data.updated_votes) {
        setChoices(prev => prev.map(c => ({
          ...c,
          votes: data.updated_votes[c.id] || c.votes
        })))
      } else {
        setChoices(prev => prev.map(c =>
          c.id === choiceId ? { ...c, votes: (c.votes || 0) + 1 } : c
        ))
      }
    } catch {
      setChoices(prev => prev.map(c =>
        c.id === choiceId ? { ...c, votes: (c.votes || 0) + 1 } : c
      ))
    }
    const today = getLocalDate()
    localStorage.setItem('voted_day', today)
    localStorage.setItem('voted_choice', String(choiceId))
    setVoted(true)
    setVotedChoice(choiceId)
    setGazing(false)
    setTimeout(() => loadState(), 1500)
  }

  // ============ 执行确认凝视逻辑 ============
  useEffect(() => {
    if (!execGazing) return
    if (execGazeTimer <= 0) {
      confirmExecution()
      return
    }
    const t = setTimeout(() => setExecGazeTimer(g => g - 1), 1000)
    return () => clearTimeout(t)
  }, [execGazing, execGazeTimer])

  const startExecGaze = () => {
    if (executed || execGazing) return
    setExecGazing(true)
    setExecGazeTimer(5)
  }

  const cancelExecGaze = () => {
    setExecGazing(false)
    setExecGazeTimer(5)
  }

  const confirmExecution = () => {
    const today = getLocalDate()
    localStorage.setItem('executed_day', today)
    // 保存到执行档案
    const archive = JSON.parse(localStorage.getItem('execution_archive') || '{}')
    archive[currentDay] = {
      action_title: todayAction?.action_title || '未知指令',
      date: today,
      executed: true
    }
    localStorage.setItem('execution_archive', JSON.stringify(archive))
    setExecuted(true)
    setExecGazing(false)
    loadArchive()
    // 信号中断转场
    setShowGlitch(true)
    setTimeout(() => setShowGlitch(false), 600)
  }

  // ============ 告解室逻辑 ============
  const generatePreview = (text) => {
    const chars = text.split('')
    const revealed = new Set()
    const count = Math.max(3, Math.floor(chars.length * 0.2))
    while (revealed.size < count) {
      revealed.add(Math.floor(Math.random() * chars.length))
    }
    return chars.map((c, i) => revealed.has(i) ? c : '█').join('')
  }

  const loadPreview = async () => {
    try {
      const res = await fetch('/api/confessions')
      const data = await res.json()
      const items = data.confessions || []
      if (items.length > 0) {
        setPreviewItems(items.slice(0, 4).map(item => ({
          ...item,
          preview: generatePreview(item.content)
        })))
      } else {
        setPreviewItems([{
          id: 'empty',
          content: '还没有人交出过秘密。',
          preview: '█████████████████████████',
          time: '--:--'
        }])
      }
    } catch {
      setPreviewItems([])
    }
  }

  const loadWall = async () => {
    try {
      const res = await fetch('/api/confessions')
      const data = await res.json()
      setWallItems(data.confessions || [])
    } catch {
      setWallItems([])
    }
  }

  const handleConfessionSubmit = async () => {
    if (confession.trim().length < 30) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/confessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: confession.trim() })
      })
      const data = await res.json()
      if (data.confessions) {
        setWallItems(data.confessions)
      }
    } catch { /* 静默 */ }
    const today = getLocalDate()
    localStorage.setItem('has_authority_date', today)
    localStorage.setItem('my_last_confession', confession.trim())
    setHasAuthority(true)
    setSubmitted(true)
    setSubmitting(false)
    setTimeout(() => loadWall(), 1500)
  }

  // 首次加载时，根据权限决定加载预览还是完整墙
  useEffect(() => {
    if (hasAuthority) {
      loadWall()
    } else {
      loadPreview()
    }
  }, [hasAuthority])

  // ============ 执行档案逻辑 ============
  const loadArchive = () => {
    const archive = JSON.parse(localStorage.getItem('execution_archive') || '{}')
    const entries = Object.entries(archive)
      .map(([day, data]) => ({ day: parseInt(day), ...data }))
      .sort((a, b) => b.day - a.day)
    setExecutionArchive(entries)
  }

  // SVG 物品渲染
  const itemSVGs = {
    mirror: (
      <svg viewBox="0 0 80 160" className="h-36 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
        <ellipse cx="40" cy="70" rx="30" ry="55" />
        <rect x="35" y="125" width="10" height="30" rx="2" />
        <line x1="15" y1="70" x2="65" y2="70" strokeWidth="0.5" opacity="0.4" />
        <line x1="40" y1="20" x2="40" y2="120" strokeWidth="0.5" opacity="0.4" />
      </svg>
    ),
    rope: (
      <svg viewBox="0 0 40 160" className="h-36 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="2">
        <path d="M20 10 C25 30, 15 50, 20 70 C25 90, 15 110, 20 130 C25 145, 20 155, 20 160" />
        <circle cx="20" cy="8" r="5" strokeWidth="1.5" />
      </svg>
    ),
    water: (
      <svg viewBox="0 0 60 120" className="h-36 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
        <path d="M10 50 L10 100 Q10 110 20 110 L40 110 Q50 110 50 100 L50 50" />
        <path d="M15 50 Q30 35 45 50" />
        <ellipse cx="30" cy="80" rx="8" ry="4" strokeWidth="0.8" opacity="0.5" />
        <ellipse cx="30" cy="70" rx="5" ry="2.5" strokeWidth="0.6" opacity="0.4" />
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 50 90" className="h-28 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
        <rect x="8" y="5" width="34" height="80" rx="4" />
        <line x1="8" y1="18" x2="42" y2="18" strokeWidth="0.8" opacity="0.5" />
        <circle cx="25" cy="78" r="3" strokeWidth="1" />
        <rect x="12" y="22" width="26" height="48" rx="1" strokeWidth="0.5" opacity="0.4" />
      </svg>
    ),
    window: (
      <svg viewBox="0 0 100 120" className="h-32 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
        <rect x="10" y="10" width="80" height="100" rx="2" />
        <line x1="50" y1="10" x2="50" y2="110" />
        <line x1="10" y1="55" x2="90" y2="55" />
        <line x1="25" y1="20" x2="25" y2="48" strokeWidth="0.5" opacity="0.3" />
        <line x1="35" y1="20" x2="35" y2="48" strokeWidth="0.5" opacity="0.25" />
      </svg>
    ),
    candle: (
      <svg viewBox="0 0 50 120" className="h-32 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
        <rect x="15" y="50" width="20" height="60" rx="2" />
        <line x1="25" y1="50" x2="25" y2="25" strokeWidth="1" />
        <ellipse cx="25" cy="20" rx="6" ry="10" strokeWidth="1" opacity="0.7" />
        <ellipse cx="25" cy="18" rx="3" ry="6" fill="#5a8f6a" opacity="0.2" />
        <line x1="20" y1="80" x2="20" y2="110" strokeWidth="0.5" opacity="0.3" />
      </svg>
    )
  }

  // 昨日执行报告
  const [yesterdayReport, setYesterdayReport] = useState(null)

  const charCount = confession.trim().length
  const charProgress = Math.min((charCount / 30) * 100, 100)

  return (
    <div className="min-h-screen bg-monitorBg text-textWhite font-terminal relative overflow-hidden">
      {/* 噪点 */}
      <div className="monitor-grain" />

      {/* 信号中断转场 */}
      {showGlitch && <div className="signal-cut"><div className="signal-noise" /></div>}

      {/* 顶部状态栏 */}
      <header className="p-3 md:p-4 border-b border-phosphorGreen/50 flex flex-wrap justify-between items-center font-pixel text-[7px] md:text-[8px] text-phosphorGreen gap-2">
        <div className="truncate crt-glow">SYS: ACTIVE // CAM-01</div>
        <div className="flex items-center gap-3">
          <span className="text-phosphorGreen/70 crt-glow">👁 {viewCount}</span>
          <div className="flex items-center gap-1">
            <span className="text-alertRed rec-pulse">●</span>
            <span className="text-alertRed crt-glow-red">REC</span>
          </div>
        </div>
        <div className="tabular-nums text-phosphorGreen/80 crt-glow">{clock}</div>
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
          <div id="items-layer" className="absolute inset-0 opacity-80 flex items-end justify-center gap-4 md:gap-8 pb-6 md:pb-8 flex-wrap px-2">
            {items.map((item, idx) => (
              <div key={item.id} className="flex flex-col items-center gap-1 fade-in-up" style={{ animationDelay: `${idx * 0.3}s` }}>
                {itemSVGs[item.slug] || (
                  <div className="w-10 h-10 md:w-12 md:h-12 border border-phosphorGreen/50 rounded flex items-center justify-center font-pixel text-[6px] md:text-[7px] text-phosphorGreen/70">
                    {item.slug?.slice(0, 3).toUpperCase()}
                  </div>
                )}
                <span className="font-pixel text-[6px] md:text-[7px] text-phosphorGreen/60">{item.name}</span>
              </div>
            ))}
            {items.length === 0 && (
              <div className="font-pixel text-[8px] text-phosphorGreen/40">[ 房间为空 · 等待第一件物品坠入 ]</div>
            )}
          </div>

          {/* 悬浮指示 */}
          <div className="absolute top-2 md:top-3 right-3 md:right-4 font-pixel text-[6px] md:text-[7px] text-phosphorGreen/80 crt-glow">
            DAY_{String(currentDay).padStart(3, '0')}
          </div>
          <div className="absolute bottom-2 md:bottom-3 left-3 md:left-4 font-pixel text-[6px] md:text-[7px] text-phosphorGreen/60">
            ITEMS: {items.length}
          </div>
          <div className="absolute bottom-2 md:bottom-3 right-3 md:right-4 font-pixel text-[6px] md:text-[7px] text-phosphorGreen/50">
            REC {clock}
          </div>
        </div>

        {/* 昨日执行报告 */}
        {yesterdayReport && (
          <section className="border border-alertRed/40 bg-monitorGlass/50 p-3 md:p-4 rounded">
            <div className="font-pixel text-[7px] text-alertRed/80 uppercase tracking-[0.2em] mb-3 crt-glow-red">// 昨日执行报告 //</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <div className="font-pixel text-[6px] text-phosphorGreen/70 mb-1">总投票数</div>
                <div className="font-pixel text-sm md:text-base text-textWhite">{yesterdayReport.total_votes}</div>
              </div>
              <div>
                <div className="font-pixel text-[6px] text-phosphorGreen/70 mb-1">坠入物品</div>
                <div className="font-pixel text-[8px] md:text-[10px] text-textWhite leading-relaxed">{yesterdayReport.winning_item}</div>
              </div>
              <div>
                <div className="font-pixel text-[6px] text-phosphorGreen/70 mb-1">执行率</div>
                <div className="font-pixel text-sm md:text-base text-alertRed crt-glow-red">{yesterdayReport.execution_rate}%</div>
              </div>
              <div>
                <div className="font-pixel text-[6px] text-phosphorGreen/70 mb-1">告解数</div>
                <div className="font-pixel text-sm md:text-base text-textWhite">{yesterdayReport.confessions_count}</div>
              </div>
            </div>
          </section>
        )}

        {/* 今日现实行动契约面板 */}
        <section className="border border-phosphorGreen/50 bg-monitorGlass/60 p-4 md:p-6 space-y-3 md:space-y-4 rounded">
          <div className="font-pixel text-[8px] text-phosphorGreen uppercase tracking-[0.2em] crt-glow">// 今日现实指令 //</div>
          {todayAction ? (
            <>
              <h2 className="font-pixel text-xs md:text-sm text-textWhite leading-relaxed crt-glow">{todayAction.action_title}</h2>
              <p className="text-base md:text-lg text-textWhite leading-relaxed indent-8">
                {todayAction.action_command}
              </p>

              {/* 执行确认按钮 */}
              <div className="pt-3 border-t border-phosphorGreen/20">
                {executed ? (
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[8px] text-phosphorGreen/80 crt-glow">✓ 已确认执行</span>
                    <span className="font-pixel text-[6px] text-phosphorGreen/40">· 不可撤回</span>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      onClick={startExecGaze}
                      disabled={execGazing}
                      className="w-full font-pixel text-[8px] py-3 tracking-[0.2em] uppercase border border-phosphorGreen/30 text-phosphorGreen/60 rounded
                                 hover:border-phosphorGreen/60 hover:text-phosphorGreen transition-all duration-300"
                    >
                      凝视 5 秒确认执行
                    </button>

                    {/* 执行凝视覆盖层 */}
                    {execGazing && (
                      <div className="absolute inset-0 bg-monitorBg/95 rounded flex flex-col items-center justify-center gap-3 z-10"
                           onClick={cancelExecGaze}>
                        <div className="font-pixel text-[7px] text-phosphorGreen/70 uppercase tracking-widest crt-glow">
                          凝视以确认执行 · 不可撤回
                        </div>
                        <div className="relative w-16 h-16">
                          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
                            <circle cx="30" cy="30" r="26" fill="none" stroke="#5a8f6a60" strokeWidth="3" />
                            <circle cx="30" cy="30" r="26" fill="none" stroke="#5a8f6a" strokeWidth="3"
                              strokeDasharray={`${(execGazeTimer / 5) * 163.36} 163.36`}
                              className="transition-all duration-1000" />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center font-pixel text-2xl text-phosphorGreen crt-glow">
                            {execGazeTimer}
                          </span>
                        </div>
                        <div className="font-pixel text-[6px] text-phosphorGreen/50">
                          点击取消
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="font-pixel text-[8px] text-phosphorGreen/50">[ 等待指令加载... ]</div>
          )}
        </section>

        {/* 明日投票区 */}
        <section className="border border-phosphorGreen/50 bg-monitorGlass/60 p-4 md:p-6 space-y-3 md:space-y-4 rounded">
          <div className="font-pixel text-[8px] text-phosphorGreen uppercase tracking-[0.2em] crt-glow">// 明日博弈 · 三选一 //</div>

          {voted && (
            <div className="text-center pb-2">
              <div className="inline-flex items-center gap-2 border border-alertRed/50 bg-alertRed/15 px-3 py-1 rounded">
                <span className="font-pixel text-[7px] text-alertRed crt-glow-red">◆ 已烙印</span>
                <span className="font-pixel text-[7px] text-textWhite/70">
                  {choices.find(c => c.id === votedChoice)?.name || '???'}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {choices.map((choice, idx) => {
              const isGazingThis = gazing && gazeTarget === choice.id
              const isVotedThis = voted && votedChoice === choice.id
              return (
                <div key={choice.id} className="relative">
                  <button
                    onClick={() => startGaze(choice.id)}
                    disabled={voted || (gazing && gazeTarget !== choice.id)}
                    className={`w-full text-left border bg-monitorGlass/40 p-3 md:p-4 rounded transition-all duration-300 group
                      ${isGazingThis
                        ? 'border-alertRed/70 bg-alertRed/10'
                        : isVotedThis
                          ? 'border-alertRed/50 bg-alertRed/10'
                          : 'border-phosphorGreen/40 hover:border-phosphorGreen/80'}
                      ${(voted || (gazing && gazeTarget !== choice.id)) ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-pixel text-[7px] text-phosphorGreen/70">物品 {idx + 1}</span>
                          {isVotedThis && (
                            <span className="font-pixel text-[6px] text-alertRed crt-glow-red">● 你的选择</span>
                          )}
                        </div>
                        <div className={`text-base text-textWhite ${voted ? '' : 'group-hover:text-phosphorGreen'} transition-colors`}>
                          {choice.name}
                        </div>
                        <div className="font-pixel text-[8px] text-textWhite/70 mt-1">
                          {choice.action_title}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className={`font-pixel text-[10px] ${isVotedThis ? 'text-alertRed crt-glow-red' : 'text-phosphorGreen/80 crt-glow'}`}>
                          {choice.votes || 0} 票
                        </div>
                        {/* 票条 */}
                        <div className="w-16 md:w-20 h-[3px] bg-phosphorGreen/20 rounded overflow-hidden">
                          <div
                            className={`h-full rounded ${isVotedThis ? 'bg-alertRed/60' : 'bg-phosphorGreen/50'}`}
                            style={{ width: `${Math.min(100, ((choice.votes || 0) / Math.max(...choices.map(c => c.votes || 1), 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* 凝视覆盖层 */}
                  {isGazingThis && (
                    <div className="absolute inset-0 bg-monitorBg/95 rounded flex flex-col items-center justify-center gap-3 z-10"
                         onClick={cancelGaze}>
                      <div className="font-pixel text-[7px] text-phosphorGreen/70 uppercase tracking-widest crt-glow">
                        凝视以确认 · 不可撤回
                      </div>
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
                          <circle cx="30" cy="30" r="26" fill="none" stroke="#a8323260" strokeWidth="3" />
                          <circle cx="30" cy="30" r="26" fill="none" stroke="#a83232" strokeWidth="3"
                            strokeDasharray={`${(gazeTimer / 5) * 163.36} 163.36`}
                            className="transition-all duration-1000" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-pixel text-2xl text-alertRed crt-glow-red">
                          {gazeTimer}
                        </span>
                      </div>
                      <div className="font-pixel text-[6px] text-phosphorGreen/50">
                        点击取消
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ========== 今日剖白 ========== */}
        <section className="border border-phosphorGreen/30 bg-monitorGlass/50 p-4 md:p-6 space-y-4 rounded">
          <div className="font-pixel text-[8px] text-phosphorGreen uppercase tracking-[0.2em] crt-glow">// 今日剖白 · 等价交换 //</div>
          <p className="text-sm text-textWhite/50 leading-relaxed">
            完成了今天的剥夺仪式？写下你的感受。交出秘密，才能窥见他人的剖白。不少于 30 字。
          </p>

          {/* 告解输入区 */}
          {!hasAuthority ? (
            <div className="border border-phosphorGreen/20 bg-monitorBg/40 p-3 md:p-4 rounded space-y-3">
              <textarea
                value={confession}
                onChange={e => setConfession(e.target.value)}
                placeholder="今天你经历了什么？被剥去了什么？主动交出了什么？写下你的真实感受..."
                className="w-full h-28 md:h-32 bg-monitorBg border border-phosphorGreen/15 rounded p-3 text-sm text-textWhite/80
                           placeholder:text-phosphorGreen/20 placeholder:font-terminal focus:outline-none focus:border-phosphorGreen/40
                           transition-colors resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="font-pixel text-[7px] text-phosphorGreen/30">
                  {charCount < 30
                    ? `筹码不足 · 还需 ${30 - charCount} 字`
                    : '筹码充足 · 可以提交'}
                </div>
                <button
                  onClick={handleConfessionSubmit}
                  disabled={charCount < 30 || submitting}
                  className={`font-pixel text-[8px] px-4 py-2 tracking-[0.2em] uppercase border rounded transition-all duration-300
                    ${charCount >= 30
                      ? 'border-phosphorGreen/50 text-phosphorGreen hover:bg-phosphorGreen/10 hover:shadow-[0_0_20px_rgba(74,107,82,0.2)]'
                      : 'border-phosphorGreen/10 text-phosphorGreen/20 cursor-not-allowed'}`}
                >
                  {submitting ? '提交中...' : '等价交换'}
                </button>
              </div>
              {/* 字数进度条 */}
              <div className="w-full h-[2px] bg-phosphorGreen/10 rounded">
                <div
                  className={`h-full rounded transition-all duration-300 ${charCount >= 30 ? 'bg-phosphorGreen/50' : 'bg-phosphorGreen/20'}`}
                  style={{ width: `${charProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="font-pixel text-[7px] text-phosphorGreen/50 text-center py-2 border border-phosphorGreen/15 rounded bg-monitorBg/30">
              {submitted ? '[ 秘密已上交 · 窥视权已激活 ]' : '[ 今日窥视权已激活 ]'}
            </div>
          )}

          {/* ========== 告解墙：完整版 ========== */}
          {hasAuthority && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-pixel text-[7px] text-phosphorGreen/70 tracking-widest uppercase crt-glow">// 他人剖白 //</div>
                <div className="font-pixel text-[6px] text-phosphorGreen/50">{wallItems.length} 条反馈</div>
              </div>
              {wallItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="border border-phosphorGreen/20 bg-monitorGlass/40 p-3 md:p-4 rounded darkroom-reveal hover:border-phosphorGreen/40 transition-colors"
                  style={{ animationDelay: `${idx * 0.5}s` }}
                >
                  <p className="text-sm md:text-base text-textWhite/85 leading-relaxed indent-6">
                    {item.content}
                  </p>
                  <div className="mt-2 flex justify-between font-pixel text-[6px] text-phosphorGreen/30">
                    <span>ANON_#{String(item.id).slice(-6)}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
              {wallItems.length === 0 && (
                <div className="border border-phosphorGreen/15 bg-monitorGlass/20 p-4 md:p-6 rounded text-center">
                  <div className="font-pixel text-[7px] text-phosphorGreen/40">[ 暂无剖白 ]</div>
                  <div className="text-xs text-textWhite/25 mt-2">成为第一个剖白者。</div>
                </div>
              )}
            </div>
          )}

          {/* ========== 窥视预览：磨砂玻璃 ========== */}
          {!hasAuthority && previewItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-pixel text-[7px] text-phosphorGreen/40 tracking-widest uppercase">// 他人剖白 · 磨砂玻璃 //</div>
                <div className="font-pixel text-[6px] text-alertRed/40">🔒 交出秘密以解锁</div>
              </div>
              {previewItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="border border-phosphorGreen/10 bg-monitorGlass/20 p-3 rounded relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-monitorBg/60 backdrop-blur-[3px] z-10 flex items-center justify-center">
                    <div className="font-pixel text-[6px] text-phosphorGreen/15 tracking-widest text-center px-4">
                      ██████ 交出你的秘密 ██████
                    </div>
                  </div>
                  <p className="text-sm text-textWhite/20 leading-relaxed blur-[2px] select-none">
                    {item.preview}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ========== 执行档案 ========== */}
        {executionArchive.length > 0 && (
          <section className="border border-phosphorGreen/20 bg-monitorGlass/30 rounded overflow-hidden">
            <button
              onClick={() => setArchiveOpen(!archiveOpen)}
              className="w-full p-3 md:p-4 flex items-center justify-between hover:bg-monitorGlass/20 transition-colors"
            >
              <div className="font-pixel text-[7px] text-phosphorGreen/60 uppercase tracking-[0.2em] crt-glow">
                // 执行档案 {archiveOpen ? '▲' : '▼'} //
              </div>
              <div className="font-pixel text-[6px] text-phosphorGreen/40">
                {executionArchive.filter(e => e.executed).length} / {currentDay} 天
              </div>
            </button>
            {archiveOpen && (
              <div className="border-t border-phosphorGreen/15 p-3 md:p-4 space-y-2">
                {executionArchive.map(entry => (
                  <div key={entry.day} className="flex items-center gap-3 font-pixel text-[7px]">
                    <span className="text-phosphorGreen/40 w-16 shrink-0">DAY {String(entry.day).padStart(3, '0')}</span>
                    <span className="text-textWhite/50 flex-1 truncate">{entry.action_title}</span>
                    <span className={entry.executed ? 'text-phosphorGreen/70 crt-glow' : 'text-textWhite/20'}>
                      {entry.executed ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
                {/* 填充未执行的天数 */}
                {(() => {
                  const archivedDays = new Set(executionArchive.map(e => e.day))
                  const missingDays = []
                  for (let d = 1; d < currentDay; d++) {
                    if (!archivedDays.has(d)) missingDays.push(d)
                  }
                  return missingDays.map(d => (
                    <div key={d} className="flex items-center gap-3 font-pixel text-[7px]">
                      <span className="text-phosphorGreen/40 w-16 shrink-0">DAY {String(d).padStart(3, '0')}</span>
                      <span className="text-textWhite/20 flex-1 truncate">[ 未记录 ]</span>
                      <span className="text-textWhite/20">✗</span>
                    </div>
                  ))
                })()}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
