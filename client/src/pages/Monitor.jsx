import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { playClick, playConfirm } from '../sound'
import itemIcons from '../itemIcons'

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
  const [executed, setExecuted] = useState(false)
  const [execGazing, setExecGazing] = useState(false)
  const [execGazeTimer, setExecGazeTimer] = useState(5)
  const [yesterdayReport, setYesterdayReport] = useState(null)

  const getLocalDate = () => {
    const d = new Date()
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
  }

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
          action_command: '今天，当你面对现实中的镜子时，必须强迫自己停下，无表情凝视自己的眼睛 3 分钟。'
        })
        setChoices([
          { id: 4, name: '一部已关机的手机', action_title: '断联剥夺', votes: 12 },
          { id: 5, name: '一扇朝北的窄窗', action_title: '视野禁闭', votes: 8 },
          { id: 6, name: '一截燃烧过半的蜡烛', action_title: '时间剥夺', votes: 15 }
        ])
      })
  }

  useEffect(() => {
    loadState()
    const votedDay = localStorage.getItem('voted_day')
    const today = getLocalDate()
    if (votedDay === today) {
      setVoted(true)
      setVotedChoice(parseInt(localStorage.getItem('voted_choice') || '0'))
    }
    const execDay = localStorage.getItem('executed_day')
    if (execDay === today) {
      setExecuted(true)
    }
  }, [])

  // ===== 投票凝视 =====
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
    playClick()
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
      }
    } catch {}
    const today = getLocalDate()
    localStorage.setItem('voted_day', today)
    localStorage.setItem('voted_choice', String(choiceId))
    setVoted(true)
    setVotedChoice(choiceId)
    setGazing(false)
    setTimeout(() => loadState(), 1500)
  }

  // ===== 执行确认凝视 =====
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
    playConfirm()
    const today = getLocalDate()
    localStorage.setItem('executed_day', today)
    const archive = JSON.parse(localStorage.getItem('execution_archive') || '{}')
    archive[currentDay] = {
      action_title: todayAction?.action_title || '未知指令',
      date: today,
      executed: true
    }
    localStorage.setItem('execution_archive', JSON.stringify(archive))
    setExecuted(true)
    setExecGazing(false)
    setShowGlitch(true)
    setTimeout(() => setShowGlitch(false), 600)
  }

  return (
    <div className="min-h-screen bg-monitorBg text-textWhite font-terminal relative overflow-hidden">
      <div className="monitor-grain" />
      {showGlitch && <div className="signal-cut"><div className="signal-noise" /></div>}

      {/* 顶部状态栏 */}
      <header className="p-3 md:p-4 border-b border-phosphorGreen/50 flex flex-wrap justify-between items-center font-pixel text-[7px] md:text-[8px] text-phosphorGreen gap-2">
        <div className="truncate crt-glow">SYS: ACTIVE // CAM-01</div>
        <div className="flex items-center gap-3">
          <span className="text-phosphorGreen/70 crt-glow">&#128065; {viewCount}</span>
          <div className="flex items-center gap-1">
            <span className="text-alertRed rec-pulse">&#9679;</span>
            <span className="text-alertRed crt-glow-red">REC</span>
          </div>
        </div>
        <div className="tabular-nums text-phosphorGreen/80 crt-glow">{clock}</div>
      </header>

      {/* 100天进度红线 */}
      <div className="w-full h-[2px] bg-monitorGlass relative">
        <div
          className="absolute left-0 top-0 h-full bg-alertRed/60 transition-all duration-1000"
          style={{ width: (currentDay / 100) * 100 + '%' }}
        />
      </div>

      <main className="max-w-4xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">

        {/* 核心监控视窗 */}
        <div id="monitor-view" className="scanlines w-full h-56 md:h-80 bg-monitorGlass border border-phosphorGreen/50 rounded relative flex items-center justify-center overflow-hidden">
          <div id="items-layer" className="absolute inset-0 opacity-80 flex items-end justify-center gap-4 md:gap-8 pb-6 md:pb-8 flex-wrap px-2">
            {items.map((item, idx) => (
              <div key={item.id} className="flex flex-col items-center gap-1 fade-in-up" style={{ animationDelay: idx * 0.3 + 's' }}>
                {itemIcons[item.slug] || (
                  <div className="w-10 h-10 md:w-12 md:h-12 border border-phosphorGreen/50 rounded flex items-center justify-center font-pixel text-[6px] md:text-[7px] text-phosphorGreen/70">
                    {item.slug ? item.slug.slice(0, 3).toUpperCase() : '???'}
                  </div>
                )}
                <span className="font-pixel text-[6px] md:text-[7px] text-phosphorGreen/60">{item.name}</span>
              </div>
            ))}
            {items.length === 0 && (
              <div className="font-pixel text-[8px] text-phosphorGreen/40">[ 房间为空 · 等待第一件物品坠入 ]</div>
            )}
          </div>
          <div className="absolute top-2 md:top-3 right-3 md:right-4 font-pixel text-[6px] md:text-[7px] text-phosphorGreen/80 crt-glow">
            DAY_{String(currentDay).padStart(3, '0')}
          </div>
          <div className="absolute bottom-2 md:bottom-3 left-3 md:left-4 font-pixel text-[6px] md:text-[7px] text-phosphorGreen/60">
            ITEMS: {items.length}
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

        {/* 今日现实指令 */}
        <section className="border border-phosphorGreen/50 bg-monitorGlass/60 p-4 md:p-6 space-y-3 md:space-y-4 rounded">
          <div className="font-pixel text-[8px] text-phosphorGreen uppercase tracking-[0.2em] crt-glow">// 今日现实指令 //</div>
          {todayAction ? (
            <>
              <h2 className="font-pixel text-xs md:text-sm text-textWhite leading-relaxed crt-glow">{todayAction.action_title}</h2>
              <p className="text-base md:text-lg text-textWhite leading-relaxed indent-8">
                {todayAction.action_command}
              </p>
            </>
          ) : (
            <div className="font-pixel text-[8px] text-phosphorGreen/50">[ 等待指令加载... ]</div>
          )}
        </section>

        {/* ===== 执行确认 —— 独立显眼面板 ===== */}
        <section className="border border-alertRed/40 bg-monitorGlass/50 p-3 md:p-4 rounded">
          <div className="font-pixel text-[7px] text-alertRed/80 uppercase tracking-[0.2em] mb-3 crt-glow-red">// 现实行动确认 //</div>

          {executed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[8px] text-phosphorGreen/80 crt-glow">&#10003; 已确认执行 · 不可撤回</span>
              </div>
              <Link
                to="/confessional"
                className="block w-full font-pixel text-[8px] py-3 tracking-[0.2em] uppercase text-center
                           border border-phosphorGreen/40 text-phosphorGreen/80 rounded
                           hover:border-phosphorGreen/80 hover:text-phosphorGreen hover:shadow-[0_0_20px_rgba(90,143,106,0.3)]
                           transition-all duration-300"
              >
                进入告解室 &rarr;
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={startExecGaze}
                disabled={execGazing}
                className="w-full font-pixel text-[8px] py-3 tracking-[0.2em] uppercase border border-alertRed/40 text-alertRed/70 rounded
                           hover:border-alertRed/70 hover:text-alertRed hover:shadow-[0_0_20px_rgba(168,50,50,0.3)]
                           transition-all duration-300"
              >
                凝视 5 秒确认执行
              </button>

              {execGazing && (
                <div className="absolute inset-0 bg-monitorBg/95 rounded flex flex-col items-center justify-center gap-3 z-10"
                     onClick={cancelExecGaze}>
                  <div className="font-pixel text-[7px] text-alertRed/70 uppercase tracking-widest crt-glow-red">
                    凝视以确认执行 · 不可撤回
                  </div>
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="26" fill="none" stroke="#a8323260" strokeWidth="3" />
                      <circle cx="30" cy="30" r="26" fill="none" stroke="#a83232" strokeWidth="3"
                        strokeDasharray={(execGazeTimer / 5) * 163.36 + ' 163.36'}
                        className="transition-all duration-1000" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-pixel text-2xl text-alertRed crt-glow-red">
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
        </section>

        {/* 明日投票区 */}
        <section className="border border-phosphorGreen/50 bg-monitorGlass/60 p-4 md:p-6 space-y-3 md:space-y-4 rounded">
          <div className="font-pixel text-[8px] text-phosphorGreen uppercase tracking-[0.2em] crt-glow">// 明日博弈 · 三选一 //</div>

          {voted && (
            <div className="text-center pb-2">
              <div className="inline-flex items-center gap-2 border border-alertRed/50 bg-alertRed/15 px-3 py-1 rounded">
                <span className="font-pixel text-[7px] text-alertRed crt-glow-red">&#9830; 已烙印</span>
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
                    className={"w-full text-left border bg-monitorGlass/40 p-3 md:p-4 rounded transition-all duration-300 group "
                      + (isGazingThis
                        ? "border-alertRed/70 bg-alertRed/10"
                        : isVotedThis
                          ? "border-alertRed/50 bg-alertRed/10"
                          : "border-phosphorGreen/40 hover:border-phosphorGreen/80")
                      + ((voted || (gazing && gazeTarget !== choice.id)) ? " opacity-60 cursor-not-allowed" : "")
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-pixel text-[7px] text-phosphorGreen/70">物品 {idx + 1}</span>
                          {isVotedThis && (
                            <span className="font-pixel text-[6px] text-alertRed crt-glow-red">&#9679; 你的选择</span>
                          )}
                        </div>
                        <div className={"text-base text-textWhite " + (voted ? "" : "group-hover:text-phosphorGreen") + " transition-colors"}>
                          {choice.name}
                        </div>
                        <div className="font-pixel text-[8px] text-textWhite/70 mt-1">
                          {choice.action_title}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className={"font-pixel text-[10px] " + (isVotedThis ? "text-alertRed crt-glow-red" : "text-phosphorGreen/80 crt-glow")}>
                          {(choice.votes || 0)} 票
                        </div>
                        <div className="w-16 md:w-20 h-[3px] bg-phosphorGreen/20 rounded overflow-hidden">
                          <div
                            className={"h-full rounded " + (isVotedThis ? "bg-alertRed/60" : "bg-phosphorGreen/50")}
                            style={{ width: Math.min(100, ((choice.votes || 0) / Math.max(...choices.map(c => c.votes || 1), 1)) * 100) + '%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>

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
                            strokeDasharray={(gazeTimer / 5) * 163.36 + ' 163.36'}
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

        {/* 底部链接 */}
        <div className="flex justify-center pb-8">
          <Link
            to="/confessional"
            className="font-pixel text-[7px] text-phosphorGreen/30 hover:text-phosphorGreen/60 transition-colors tracking-[0.2em] uppercase"
          >
            告解室 &rarr;
          </Link>
        </div>
      </main>
    </div>
  )
}
