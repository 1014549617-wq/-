import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Confessional() {
  const [confession, setConfession] = useState('')
  const [hasAuthority, setHasAuthority] = useState(false)
  const [wallItems, setWallItems] = useState([])
  const [previewItems, setPreviewItems] = useState([])
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

  // 生成模糊预览文字（给未提交者看的磨砂玻璃效果）
  const generatePreview = (text) => {
    const chars = text.split('')
    const revealed = new Set()
    // 只露 20% 的字
    const count = Math.max(3, Math.floor(chars.length * 0.2))
    while (revealed.size < count) {
      revealed.add(Math.floor(Math.random() * chars.length))
    }
    return chars.map((c, i) => revealed.has(i) ? c : '█').join('')
  }

  // 检查今日权限 + 加载预览
  useEffect(() => {
    const today = getLocalDate()
    const authorityDate = localStorage.getItem('has_authority_date')
    if (authorityDate === today) {
      setHasAuthority(true)
      loadWall()
    } else {
      loadPreview()
    }
  }, [])

  // 加载模糊预览（未交出秘密前）
  const loadPreview = async () => {
    try {
      const res = await fetch('/api/confessions')
      const data = await res.json()
      const items = data.confessions || []
      if (items.length > 0) {
        setPreviewItems(items.slice(0, 6).map(item => ({
          ...item,
          preview: generatePreview(item.content)
        })))
      } else {
        // 还没有人提交过，显示占位
        setPreviewItems([{
          id: 'empty',
          content: '还没有人交出过秘密。成为第一个？',
          preview: '█████████████████████████',
          time: '--:--'
        }])
      }
    } catch {
      setPreviewItems([{
        id: 'err',
        content: '信号中断。等待恢复...',
        preview: '██████ 信号中断 ██████',
        time: '--:--'
      }])
    }
  }

  // 加载完整告解墙（真人告解）
  const loadWall = async () => {
    try {
      const res = await fetch('/api/confessions')
      const data = await res.json()
      setWallItems(data.confessions || [])
    } catch {
      setWallItems([])
    }
  }

  const handleSubmit = async () => {
    if (confession.trim().length < 30) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/confessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: confession.trim() })
      })
      const data = await res.json()
      // 如果后端返回了更新后的告解列表，直接用
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
    // 延迟刷新确保 Blobs 一致性
    setTimeout(() => loadWall(), 1500)
  }

  const charCount = confession.trim().length
  const progress = Math.min((charCount / 30) * 100, 100)

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
                {charCount < 30
                  ? `筹码不足 · 还需 ${30 - charCount} 字`
                  : '筹码充足 · 可以提交'}
              </div>
              <button
                onClick={handleSubmit}
                disabled={charCount < 30 || submitting}
                className={`font-pixel text-[8px] px-5 py-2 tracking-[0.2em] uppercase border rounded transition-all duration-300
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
                style={{ width: `${progress}%` }}
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

        {/* ========== 告解墙：完整版（已交出秘密） ========== */}
        {hasAuthority && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-pixel text-[7px] text-phosphorGreen/70 tracking-widest uppercase crt-glow">// 他人告解 · 真人提交 //</div>
              <div className="font-pixel text-[6px] text-phosphorGreen/50">{wallItems.length} 条秘密</div>
            </div>

            {wallItems.map((item, idx) => (
              <div
                key={item.id}
                className="border border-phosphorGreen/30 bg-monitorGlass/50 p-3 md:p-4 rounded darkroom-reveal hover:border-phosphorGreen/50 transition-colors"
                style={{ animationDelay: `${idx * 0.6}s` }}
              >
                <p className="text-sm md:text-base text-textWhite/85 leading-relaxed indent-6">
                  {item.content}
                </p>
                <div className="mt-3 flex justify-between font-pixel text-[7px] text-phosphorGreen/40">
                  <span>ANON_#{String(item.id).slice(-6)}</span>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}

            {wallItems.length === 0 && (
              <div className="border border-phosphorGreen/20 bg-monitorGlass/30 p-6 md:p-8 rounded text-center space-y-3">
                <div className="font-pixel text-[8px] text-phosphorGreen/50">[ 暂无告解记录 ]</div>
                <div className="text-xs text-textWhite/30">暗房里还没有人交出过秘密。<br />成为第一个剖白者。</div>
              </div>
            )}
          </div>
        )}

        {/* ========== 窥视预览：磨砂玻璃（未交出秘密） ========== */}
        {!hasAuthority && previewItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-pixel text-[7px] text-phosphorGreen/50 tracking-widest uppercase">// 窥视预览 · 磨砂玻璃 //</div>
              <div className="font-pixel text-[6px] text-alertRed/50">🔒 交出秘密以解锁</div>
            </div>

            {previewItems.map((item, idx) => (
              <div
                key={item.id}
                className="border border-phosphorGreen/10 bg-monitorGlass/20 p-3 md:p-4 rounded relative overflow-hidden"
                style={{ animationDelay: `${idx * 0.4}s` }}
              >
                {/* 磨砂模糊覆盖 */}
                <div className="absolute inset-0 bg-monitorBg/60 backdrop-blur-[3px] z-10 flex items-center justify-center">
                  <div className="font-pixel text-[7px] text-phosphorGreen/20 tracking-widest text-center px-4">
                    ██████ 交出你的秘密 ██████
                  </div>
                </div>
                <p className="text-sm md:text-base text-textWhite/25 leading-relaxed indent-6 blur-[2px] select-none">
                  {item.preview}
                </p>
                <div className="mt-3 flex justify-between font-pixel text-[7px] text-phosphorGreen/10">
                  <span>ANON_████</span>
                  <span>██:██</span>
                </div>
              </div>
            ))}
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
