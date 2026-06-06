import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Entrance() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0) // 0=倒计时 1=契约显示 2=已同意
  const [countdown, setCountdown] = useState(3)
  const [typedText, setTypedText] = useState('')
  const [showGlitch, setShowGlitch] = useState(false)
  const fullText = '你即将进入一个被监控的空间。在这里，你没有名字，没有身份。每过一天，一件新物品将坠入房间；每过一天，你必须交出部分自由。没有人会记住你来过——除非你自己选择留下痕迹。'

  // 倒计时阶段
  useEffect(() => {
    if (phase !== 0) return
    if (countdown <= 0) {
      // 触发信号中断转场
      setShowGlitch(true)
      setTimeout(() => {
        setShowGlitch(false)
        setPhase(1)
      }, 600)
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
    }, 45)
    return () => clearInterval(timer)
  }, [phase])

  // 已同意后延迟跳转（带信号中断转场）
  const handleEnter = () => {
    setPhase(2)
    setShowGlitch(true)
    setTimeout(() => {
      setShowGlitch(false)
      navigate('/monitor')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-monitorBg text-textWhite font-terminal relative overflow-hidden flex items-center justify-center">
      {/* 噪点层 */}
      <div className="monitor-grain" />

      {/* 信号中断全屏转场 */}
      {showGlitch && (
        <div className="signal-cut">
          <div className="signal-noise" />
        </div>
      )}

      {/* 十字准星装饰 —— 手机端缩小，桌面端保持原尺寸 */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[280px] h-[280px] md:w-[600px] md:h-[600px] border border-phosphorGreen/10 rounded-full" />
        <div className="absolute w-[180px] h-[180px] md:w-[400px] md:h-[400px] border border-phosphorGreen/5 rounded-full" />
        <div className="absolute w-px h-40 bg-phosphorGreen/10" />
        <div className="absolute h-px w-40 bg-phosphorGreen/10" />
      </div>

      {/* === 阶段 0：倒计时闸门 === */}
      {phase === 0 && (
        <div className="relative z-10 text-center fade-in-up">
          <div className="font-pixel text-[7px] text-phosphorGreen/30 tracking-[0.5em] uppercase mb-8">
            Access Protocol Initiated
          </div>
          <div className="relative">
            {/* 倒计时数字 - 色差抖动效果 */}
            <span className="font-pixel text-[120px] md:text-[180px] text-alertRed/80 countdown-glitch leading-none">
              {countdown > 0 ? countdown : ''}
            </span>
          </div>
          <div className="font-pixel text-[7px] text-alertRed/40 tracking-[0.3em] uppercase mt-8 rec-pulse">
            ◆ STANDBY ◆
          </div>
        </div>
      )}

      {/* === 阶段 1：契约显示 === */}
      {phase === 1 && (
        <div className="relative z-10 max-w-xl px-8 text-center space-y-10 fade-in-up">
          {/* 标题 */}
          <div className="space-y-4">
            <div className="font-pixel text-[8px] tracking-[0.4em] text-phosphorGreen/40 uppercase">
              Project Deprivation
            </div>
            <h1 className="font-pixel text-2xl md:text-3xl tracking-[0.15em] text-textWhite flicker">
              剥 夺 计 划
            </h1>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-phosphorGreen/50 to-transparent" />
          </div>

          {/* 契约文 */}
          <div className="min-h-[180px] text-lg leading-loose text-textWhite/70 text-left indent-8">
            <span>{typedText}</span>
            {typedText.length < fullText.length && (
              <span className="typing-cursor">&nbsp;</span>
            )}
          </div>

          {/* 心理契约按钮 */}
          {typedText.length >= fullText.length && (
            <div className="space-y-4 fade-in-up">
              <div className="font-pixel text-[8px] text-phosphorGreen/40 tracking-widest uppercase">
                // 心理契约 //
              </div>
              <button
                onClick={handleEnter}
                className="glitch-hover font-pixel text-[9px] border border-phosphorGreen/50 text-phosphorGreen px-8 py-3 tracking-[0.2em] uppercase
                           hover:bg-phosphorGreen/10 hover:border-phosphorGreen transition-all duration-500"
              >
                我接受一切后果
              </button>
              <div className="font-pixel text-[7px] text-phosphorGreen/20 mt-2">
                此操作不可逆。你将自愿放弃匿名的庇护。
              </div>
            </div>
          )}
        </div>
      )}

      {/* === 阶段 2：已同意 === */}
      {phase === 2 && (
        <div className="relative z-10 font-pixel text-[9px] text-phosphorGreen tracking-[0.2em] uppercase fade-in-up">
          [ 契约已确认 · 接入中... ]
        </div>
      )}
    </div>
  )
}
