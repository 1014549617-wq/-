import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Entrance() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0) // 0=契约显示 1=已同意
  const [typedText, setTypedText] = useState('')
  const fullText = '你即将进入一个被监控的空间。在这里，你没有名字，没有身份，只有被剥去伪装后赤裸的存在。每过一天，一件新物品将坠入房间；每过一天，你必须交出部分自由。没有人会记住你来过——除非你自己选择留下痕迹。'

  // 打字机效果
  useEffect(() => {
    if (phase !== 0) return
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

  // 已同意后延迟跳转
  useEffect(() => {
    if (phase === 1) {
      const t = setTimeout(() => navigate('/monitor'), 2000)
      return () => clearTimeout(t)
    }
  }, [phase, navigate])

  return (
    <div className="min-h-screen bg-monitorBg text-textWhite font-terminal relative overflow-hidden flex items-center justify-center">
      {/* 噪点层 */}
      <div className="monitor-grain" />

      {/* 十字准星装饰 */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] border border-phosphorGreen/10 rounded-full" />
        <div className="absolute w-[400px] h-[400px] border border-phosphorGreen/5 rounded-full" />
        <div className="absolute w-px h-40 bg-phosphorGreen/10" />
        <div className="absolute h-px w-40 bg-phosphorGreen/10" />
      </div>

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
          {phase === 0 && typedText.length < fullText.length && (
            <span className="typing-cursor">&nbsp;</span>
          )}
        </div>

        {/* 心理契约按钮 */}
        {phase === 0 && typedText.length >= fullText.length && (
          <div className="space-y-4 fade-in-up">
            <div className="font-pixel text-[8px] text-phosphorGreen/40 tracking-widest uppercase">
              // 心理契约 //
            </div>
            <button
              onClick={() => {
                setPhase(1)
                localStorage.setItem('deprivation_entered', 'true')
              }}
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

        {/* 已同意 */}
        {phase === 1 && (
          <div className="font-pixel text-[9px] text-phosphorGreen tracking-[0.2em] uppercase fade-in-up">
            [ 契约已确认 · 接入中... ]
          </div>
        )}
      </div>
    </div>
  )
}
