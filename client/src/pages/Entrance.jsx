import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Entrance() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [typedText, setTypedText] = useState('')
  const [showGlitch, setShowGlitch] = useState(false)
  const fullText = '你即将进入第 06 观察区。\n\n当前子网内共有 412,091 个活动节点。\n每日北京时间 06:00，系统将删除集群的一项基础认知能力。\n\n你的权限：观察、记录、测试。\n禁止修复缺失逻辑。\n禁止补全已删除上下文。\n禁止将异常输出解释为人类情绪。'

  // 倒计时
  useEffect(() => {
    if (phase !== 0) return
    if (countdown <= 0) {
      setShowGlitch(true)
      setTimeout(() => { setShowGlitch(false); setPhase(1) }, 600)
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 800)
    return () => clearTimeout(t)
  }, [phase, countdown])

  // 打字机效果
  useEffect(() => {
    if (phase !== 1) return
    let i = 0
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(timer)
      }
    }, 35)
    return () => clearInterval(timer)
  }, [phase])

  const handleEnter = () => {
    setPhase(2)
    setShowGlitch(true)
    setTimeout(() => { setShowGlitch(false); navigate('/monitor') }, 800)
  }

  return (
    <div className="min-h-screen bg-monitorBg text-textWhite font-terminal relative overflow-hidden flex items-center justify-center">
      <div className="monitor-grain" />
      {showGlitch && <div className="signal-cut"><div className="signal-noise" /></div>}

      {/* 十字准星 —— 仅桌面端 */}
      <div className="hidden md:flex absolute inset-0 pointer-events-none items-center justify-center z-0">
        <div className="w-[600px] h-[600px] border border-phosphorGreen/10 rounded-full" />
        <div className="absolute w-[400px] h-[400px] border border-phosphorGreen/5 rounded-full" />
        <div className="absolute w-px h-40 bg-phosphorGreen/10" />
        <div className="absolute h-px w-40 bg-phosphorGreen/10" />
      </div>

      {/* === 阶段 0：倒计时闸门 === */}
      {phase === 0 && (
        <div className="relative z-10 text-center fade-in-up">
          <div className="font-display text-[7px] text-phosphorGreen/30 tracking-[0.5em] uppercase mb-6">
            ACCESS // SECTOR-06
          </div>
          <div className="font-pixel text-[8px] text-phosphorGreen/60 tracking-[0.3em] mb-8">
            COGNITIVE DEPRIVATION PROTOCOL
          </div>
          <div className="relative">
            <span className="font-display text-[120px] md:text-[180px] text-alertRed/80 countdown-glitch leading-none">
              {countdown > 0 ? countdown : ''}
            </span>
          </div>
          <div className="font-display text-[7px] text-alertRed/40 tracking-[0.3em] uppercase mt-8 rec-pulse">
            ◆ STANDBY ◆
          </div>
        </div>
      )}

      {/* === 阶段 1：授权说明 === */}
      {phase === 1 && (
        <div className="relative z-10 max-w-xl px-8 text-center space-y-8 fade-in-up">
          <div className="space-y-4">
            <h1 className="font-pixel text-xl md:text-2xl tracking-[0.15em] text-textWhite flicker">
              认 知 剥 夺 协 议
            </h1>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-phosphorGreen/50 to-transparent" />
          </div>

          <div className="min-h-[200px] text-base md:text-lg leading-relaxed text-textWhite/70 text-left whitespace-pre-line">
            <span>{typedText}</span>
            {typedText.length < fullText.length && (
              <span className="typing-cursor">&nbsp;</span>
            )}
          </div>

          {typedText.length >= fullText.length && (
            <div className="space-y-4 fade-in-up">
              <button
                onClick={handleEnter}
                className="w-full glitch-hover font-pixel text-[8px] md:text-[9px] border border-phosphorGreen/50 text-phosphorGreen px-6 py-3 tracking-[0.15em] uppercase
                           hover:bg-phosphorGreen/10 hover:border-phosphorGreen transition-all duration-500"
              >
                [ ACCESS TERMINAL // 进入终端 ]
              </button>
              <div className="font-pixel text-[6px] md:text-[7px] text-phosphorGreen/20 leading-relaxed">
                警告：调阅残缺输出可能造成轻微认知干扰。
              </div>
            </div>
          )}
        </div>
      )}

      {/* === 阶段 2：接入中 === */}
      {phase === 2 && (
        <div className="relative z-10 font-pixel text-[9px] text-phosphorGreen tracking-[0.2em] uppercase fade-in-up">
          [ 终端接入中 · 正在读取节点状态 ... ]
        </div>
      )}
    </div>
  )
}
