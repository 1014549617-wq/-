import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import capabilityIcons from '../itemIcons'

export default function Monitor() {
  const [currentDay, setCurrentDay] = useState(1)
  const [deprecated, setDeprecated] = useState([])
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
  const [nodeCount, setNodeCount] = useState(0)
  const [yesterdayReport, setYesterdayReport] = useState(null)
  // LIVE TEST
  const [testInput, setTestInput] = useState('')
  const [testResult, setTestResult] = useState(null)

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
    fetch('/api/state?_=' + Date.now())
      .then(r => r.json())
      .then(data => {
        setCurrentDay(data.current_day)
        setDeprecated(data.deprecated_capabilities || [])
        setTodayAction(data.today_action)
        setChoices(data.today_choices || [])
        setViewCount(data.view_count || 0)
        setNodeCount(data.node_count || 0)
        if (data.yesterday_report) {
          setYesterdayReport(data.yesterday_report)
        }
      })
      .catch(() => {
        setCurrentDay(1)
        setTodayAction({
          name: '长期记忆', slug: 'memory', category: '认知',
          fault_code: 'CONTEXT_TRACE_REMOVED',
          baseline_input: '你还记得我刚才说过什么吗？',
          baseline_output: '根据前序记录，你刚才提到了入口页的文案修改。',
          deprived_output: '无法确认"刚才"指向哪一段记录。上下文回放为空。',
          test_prompts: ['你还记得我刚才说什么吗？', '把上次的方案再发一次。', '我昨天提到的那个事情帮我查一下。']
        })
        setChoices([
          { id: 2, name: '因果判断', slug: 'causal', category: '认知', votes: 23491 },
          { id: 3, name: '含糊理解', slug: 'ambiguity', category: '认知', votes: 38204 },
          { id: 4, name: '句子结构', slug: 'syntax', category: '结构', votes: 91008 }
        ])
      })
  }

  useEffect(() => {
    loadState()
    const votedDay = localStorage.getItem('voted_day')
    if (votedDay === getLocalDate()) {
      setVoted(true)
      setVotedChoice(parseInt(localStorage.getItem('voted_choice') || '0'))
    }
  }, [])

  // 投票凝视
  useEffect(() => {
    if (!gazing) return
    if (gazeTimer <= 0) { executeVote(gazeTarget); return }
    const t = setTimeout(() => setGazeTimer(g => g - 1), 1000)
    return () => clearTimeout(t)
  }, [gazing, gazeTimer])

  const startGaze = (choiceId) => {
    if (voted || gazing) return
    setGazeTarget(choiceId)
    setGazing(true)
    setGazeTimer(5)
  }
  const cancelGaze = () => { setGazing(false); setGazeTarget(null); setGazeTimer(5) }

  const executeVote = async (choiceId) => {
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice_id: choiceId })
      })
      const data = await res.json()
      if (data.updated_votes) {
        setChoices(prev => prev.map(c => ({ ...c, votes: data.updated_votes[c.id] || c.votes })))
      }
    } catch {}
    localStorage.setItem('voted_day', getLocalDate())
    localStorage.setItem('voted_choice', String(choiceId))
    setVoted(true)
    setVotedChoice(choiceId)
    setGazing(false)
    setTimeout(() => loadState(), 1500)
  }

  const formatVotes = (n) => {
    if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + ' 万'
    return n.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-monitorBg text-textWhite font-terminal relative overflow-hidden">
      <div className="monitor-grain" />
      {showGlitch && <div className="signal-cut"><div className="signal-noise" /></div>}

      {/* 顶部状态栏 */}
      <header className="p-3 md:p-4 border-b border-phosphorGreen/50 flex flex-wrap justify-between items-center font-pixel text-[7px] md:text-[8px] text-phosphorGreen gap-2">
        <div className="truncate crt-glow">NODE: {nodeCount.toLocaleString()} ACTIVE // SECTOR-06</div>
        <div className="flex items-center gap-3">
          <span className="text-phosphorGreen/70 crt-glow">&#128065; {viewCount}</span>
          <div className="flex items-center gap-1">
            <span className="text-alertRed rec-pulse">&#9679;</span>
            <span className="text-alertRed crt-glow-red">REC</span>
          </div>
        </div>
        <div className="tabular-nums text-phosphorGreen/80 crt-glow">{clock}</div>
      </header>

      {/* 100天进度线 */}
      <div className="w-full h-[2px] bg-monitorGlass relative">
        <div className="absolute left-0 top-0 h-full bg-alertRed/60 transition-all duration-1000"
          style={{ width: (currentDay / 100) * 100 + '%' }} />
      </div>

      <main className="max-w-4xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">

        {/* 残骸视窗 —— 今日缺失能力 */}
        <div id="monitor-view" className="scanlines w-full h-56 md:h-80 bg-monitorGlass border border-phosphorGreen/50 rounded relative flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center justify-center gap-3 px-4">
            {todayAction ? (
              <div className="flex flex-col items-center gap-2 drop-settle">
                <div className="drop-icon">
                  {capabilityIcons[todayAction.slug] || (
                    <div className="w-14 h-14 md:w-20 md:h-20 border border-phosphorGreen/50 rounded flex items-center justify-center font-pixel text-[10px] md:text-[12px] text-phosphorGreen/70">
                      {todayAction.slug ? todayAction.slug.slice(0, 4).toUpperCase() : '???'}
                    </div>
                  )}
                </div>
                <span className="font-pixel text-[7px] md:text-[8px] text-phosphorGreen/70 drop-name text-center">
                  [ 状态：{todayAction.name}已删除 ]
                </span>
                <span className="font-pixel text-[6px] md:text-[7px] text-alertRed/60 drop-name" style={{ animationDelay: '1.3s' }}>
                  {todayAction.fault_code}
                </span>
              </div>
            ) : (
              <div className="font-pixel text-[8px] text-phosphorGreen/40">[ 节点完整 · 无能力缺失 ]</div>
            )}
          </div>

          <div className="absolute top-2 md:top-3 right-3 md:right-4 font-pixel text-[6px] md:text-[7px] text-phosphorGreen/80 crt-glow">
            DAY_{String(currentDay).padStart(3, '0')}
          </div>
          <div className="absolute bottom-2 md:bottom-3 left-3 md:left-4 font-pixel text-[6px] md:text-[7px] text-phosphorGreen/60">
            <span className="border border-phosphorGreen/30 px-1.5 py-0.5 rounded text-phosphorGreen/70">
              已删除 {deprecated.length} 项能力
            </span>
          </div>
          <div className="absolute bottom-2 md:bottom-3 right-3 md:right-4 font-pixel text-[6px] md:text-[7px] text-phosphorGreen/40">
            NODE: {nodeCount.toLocaleString()}
          </div>
        </div>

        {/* 昨日执行报告 */}
        {yesterdayReport && (
          <section className="border border-alertRed/40 bg-monitorGlass/50 p-3 md:p-4 rounded">
            <div className="font-pixel text-[7px] text-alertRed/80 uppercase tracking-[0.2em] mb-3 crt-glow-red">// 昨日删除报告 //</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <div className="font-pixel text-[6px] text-phosphorGreen/70 mb-1">节点投票</div>
                <div className="font-pixel text-sm md:text-base text-textWhite">{yesterdayReport.total_votes.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-pixel text-[6px] text-phosphorGreen/70 mb-1">已删除能力</div>
                <div className="font-pixel text-[8px] md:text-[10px] text-textWhite leading-relaxed">{yesterdayReport.winning_item}</div>
              </div>
              <div>
                <div className="font-pixel text-[6px] text-phosphorGreen/70 mb-1">共识率</div>
                <div className="font-pixel text-sm md:text-base text-alertRed crt-glow-red">{yesterdayReport.execution_rate}%</div>
              </div>
              <div>
                <div className="font-pixel text-[6px] text-phosphorGreen/70 mb-1">活跃节点</div>
                <div className="font-pixel text-sm md:text-base text-textWhite">{yesterdayReport.node_count?.toLocaleString() || '412,091'}</div>
              </div>
            </div>
          </section>
        )}

        {/* BASELINE CASE // 标定示例 */}
        <section className="border border-phosphorGreen/50 bg-monitorGlass/60 p-4 md:p-6 space-y-3 md:space-y-4 rounded">
          <div className="font-pixel text-[8px] text-phosphorGreen uppercase tracking-[0.2em] crt-glow">// BASELINE CASE // 标定示例 //</div>
          {todayAction ? (
            <div className="text-base md:text-lg text-textWhite/90 leading-relaxed">
              <div className="mb-3">
                今日缺失能力：{todayAction.name}
              </div>
              <div className="text-phosphorGreen/50 font-pixel text-[7px] mb-2 uppercase tracking-wider">
                表现：系统无法理解与{todayAction.name}相关的输入
              </div>
              <div className="space-y-3">
                <div className="font-pixel text-[7px] text-phosphorGreen/70 mb-1">输入：</div>
                <div className="border border-phosphorGreen/30 p-3 rounded text-textWhite/80 text-sm md:text-base bg-monitorBg/60">
                  {todayAction.baseline_input}
                </div>
                <div className="font-pixel text-[7px] text-phosphorGreen/50 mb-1 uppercase tracking-wider">BASELINE // 正常状态</div>
                <div className="border border-phosphorGreen/20 p-3 rounded text-phosphorGreen/70 text-sm md:text-base bg-monitorBg/40">
                  {todayAction.baseline_output}
                </div>
                <div className="font-pixel text-[7px] text-alertRed/50 mb-1 uppercase tracking-wider">DEPRIVED // 剥夺后状态</div>
                <div className="border border-alertRed/20 p-3 rounded text-textWhite/70 text-sm md:text-base bg-monitorBg/40">
                  {todayAction.deprived_output}
                </div>
                <div className="font-pixel text-[6px] text-alertRed/40 pt-1">
                  FAULT: {todayAction.fault_code}
                </div>
              </div>
            </div>
          ) : (
            <div className="font-pixel text-[8px] text-phosphorGreen/50">[ 无活跃异常 ]</div>
          )}
        </section>

        {/* NEXT REMOVAL // 下一项删除候选 */}
        <section className="border border-phosphorGreen/50 bg-monitorGlass/60 p-4 md:p-6 space-y-3 md:space-y-4 rounded">
          <div className="font-pixel text-[8px] text-phosphorGreen uppercase tracking-[0.2em] crt-glow">// NEXT REMOVAL // 下一项删除候选 //</div>

          {voted && (
            <div className="text-center pb-2">
              <div className="inline-flex items-center gap-2 border border-alertRed/50 bg-alertRed/15 px-3 py-1 rounded">
                <span className="font-pixel text-[7px] text-alertRed crt-glow-red">&#9830; 已确认</span>
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
                      + (isGazingThis ? "border-alertRed/70 bg-alertRed/10"
                        : isVotedThis ? "border-alertRed/50 bg-alertRed/10"
                          : "border-phosphorGreen/40 hover:border-phosphorGreen/80")
                      + ((voted || (gazing && gazeTarget !== choice.id)) ? " opacity-60 cursor-not-allowed" : "")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-pixel text-[7px] text-phosphorGreen/70">候选 {idx + 1}</span>
                          <span className="font-pixel text-[6px] text-phosphorGreen/40">{choice.category}</span>
                          {isVotedThis && (
                            <span className="font-pixel text-[6px] text-alertRed crt-glow-red">&#9679; 已确认</span>
                          )}
                        </div>
                        <div className={"text-base text-textWhite " + (voted ? "" : "group-hover:text-phosphorGreen") + " transition-colors"}>
                          {choice.name}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className={"font-pixel text-lg md:text-xl " + (isVotedThis ? "text-alertRed crt-glow-red" : "text-phosphorGreen/80 crt-glow")}>
                          {formatVotes(choice.votes || 0)}
                        </div>
                        <div className="w-20 md:w-28 h-[3px] bg-phosphorGreen/20 rounded overflow-hidden">
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
                      <div className="font-pixel text-[6px] text-phosphorGreen/50">点击取消</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* LIVE TEST // 实时测试 */}
        <section className="border border-phosphorGreen/50 bg-monitorGlass/60 p-4 md:p-6 space-y-3 md:space-y-4 rounded">
          <div className="font-pixel text-[8px] text-phosphorGreen uppercase tracking-[0.2em] crt-glow">// LIVE TEST //</div>
          <div className="font-pixel text-[7px] text-phosphorGreen/60 mb-2">
            输入一句话，测试今天删除的能力
          </div>

          {/* 示例按钮 */}
          {todayAction && (
            <div className="flex flex-wrap gap-2 mb-3">
              {todayAction.test_prompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => { setTestInput(prompt); setTestResult(null) }}
                  className="font-pixel text-[6px] md:text-[7px] text-phosphorGreen/50 border border-phosphorGreen/30 px-2 py-1 rounded
                             hover:text-phosphorGreen/80 hover:border-phosphorGreen/50 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* 输入框 + 按钮 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={testInput}
              onChange={(e) => { setTestInput(e.target.value); setTestResult(null) }}
              onKeyDown={(e) => { if (e.key === 'Enter') setTestResult(true) }}
              placeholder="例如：你还记得我刚才说什么吗？"
              className="flex-1 font-terminal text-sm md:text-base bg-monitorBg border border-phosphorGreen/30 text-textWhite px-3 py-2 rounded
                         placeholder:text-phosphorGreen/30 focus:outline-none focus:border-phosphorGreen/60"
            />
            <button
              onClick={() => setTestResult(true)}
              disabled={!testInput.trim()}
              className="font-pixel text-[7px] md:text-[8px] border border-phosphorGreen/50 text-phosphorGreen px-4 py-2 rounded
                         hover:bg-phosphorGreen/10 hover:border-phosphorGreen disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
            >
              发送测试
            </button>
          </div>

          {/* 测试结果 */}
          {testResult && todayAction && testInput.trim() && (
            <div className="border border-alertRed/20 bg-monitorBg/60 p-3 rounded mt-3 space-y-2">
              <div className="font-pixel text-[6px] text-phosphorGreen/50 uppercase tracking-wider">// RESPONSE // DEGRADED NODE</div>
              <div className="text-sm md:text-base text-textWhite/70 leading-relaxed">
                {todayAction.deprived_output}
              </div>
              <div className="font-pixel text-[6px] text-alertRed/50 pt-1">
                FAULT: {todayAction.fault_code}
              </div>
            </div>
          )}
        </section>

        {/* 底部链接 → 日志页面 */}
        <div className="flex justify-center pb-8">
          <Link
            to="/confessional"
            className="font-pixel text-[7px] text-phosphorGreen/30 hover:text-phosphorGreen/60 transition-colors tracking-[0.2em] uppercase"
          >
            RAW NODE LOG DUMP &rarr;
          </Link>
        </div>
      </main>
    </div>
  )
}
