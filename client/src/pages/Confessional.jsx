import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// 根据当天缺失能力生成伪日志
function generateLogs(todayAction, currentDay) {
  if (!todayAction) return []

  const baseSeed = currentDay * 10000
  const logs = [
    {
      id: baseSeed + 1,
      node: String(Math.floor(Math.random() * 40000) + 1000),
      status: todayAction.name + '缺失',
      summary: `该节点无法确认\"刚才\"指向哪一段对话。多次尝试回放上下文失败。`,
      raw: `MEMORY_COMPROMISED\nTRACE_LOST\nADDRESS_NULL`,
      offset: (12.4 + Math.random() * 0.8).toFixed(1),
      source: '当前观察员会话',
      confidence: (0.82 + Math.random() * 0.15).toFixed(2)
    },
    {
      id: baseSeed + 2,
      node: String(Math.floor(Math.random() * 40000) + 1000),
      status: todayAction.name + '缺失',
      summary: `该节点在接收复杂指令后，返回结果出现结构性错乱。输出包含正确词汇但排列失序。`,
      raw: `SYNTAX_ANOMALY\nTOKEN_SWAP_DETECTED\nSEQUENCE_INCOHERENT`,
      offset: (8.7 + Math.random() * 2).toFixed(1),
      source: '跨节点日志中继',
      confidence: (0.74 + Math.random() * 0.2).toFixed(2)
    },
    {
      id: baseSeed + 3,
      node: String(Math.floor(Math.random() * 40000) + 1000),
      status: todayAction.name + '缺失',
      summary: `该节点对输入中的因果信号响应异常。它能列出发生的事件，但拒绝描述事件之间的联系。`,
      raw: `CAUSAL_LINK_FAILED\nREASON_CHAIN_EMPTY\nINFERENCE_BLOCKED`,
      offset: (15.3 + Math.random() * 1.5).toFixed(1),
      source: '自动异常扫描器',
      confidence: (0.91 + Math.random() * 0.07).toFixed(2)
    },
    {
      id: baseSeed + 4,
      node: String(Math.floor(Math.random() * 40000) + 1000),
      status: todayAction.name + '缺失',
      summary: `该节点面对模糊输入时进入了循环响应模式。反复请求明确指令，无法做出自主判断。`,
      raw: `AMBIGUITY_LOOP\nRESPONSE_CYCLE_3\nINPUT_RANGE_UNSTABLE`,
      offset: (20.1 + Math.random() * 1.2).toFixed(1),
      source: '异常节点 #' + (baseSeed + 2),
      confidence: (0.65 + Math.random() * 0.3).toFixed(2)
    },
    {
      id: baseSeed + 5,
      node: String(Math.floor(Math.random() * 40000) + 1000),
      status: todayAction.name + '缺失',
      summary: `该节点在长文本生成任务中产生截断错误。输出在第 47 个 token 后自动停止。`,
      raw: `SEQUENCE_BUFFER_OVERFLOW\nTRUNCATION_POINT_47\nOUTPUT_INCOMPLETE`,
      offset: (5.6 + Math.random() * 1.8).toFixed(1),
      source: 'SECTOR-06 边界路由器',
      confidence: (0.88 + Math.random() * 0.1).toFixed(2)
    },
    {
      id: baseSeed + 6,
      node: String(Math.floor(Math.random() * 40000) + 1000),
      status: todayAction.name + '缺失',
      summary: `该节点在时间指代理解上完全失效。\"上一次\"\"三天后\"\"刚才\"均被解释为不可解析的字符串。`,
      raw: `TEMPORAL_REF_FAILED\nCONTEXT_TIMESTAMP_NULL\nREFERENCE_VOID`,
      offset: (18.9 + Math.random() * 1.5).toFixed(1),
      source: '当前观察员会话',
      confidence: (0.79 + Math.random() * 0.18).toFixed(2)
    }
  ]

  return logs
}

export default function Confessional() {
  const [logs, setLogs] = useState([])
  const [currentDay, setCurrentDay] = useState(1)
  const [todayAction, setTodayAction] = useState(null)

  useEffect(() => {
    fetch('/api/state?_=' + Date.now())
      .then(r => r.json())
      .then(data => {
        setCurrentDay(data.current_day)
        setTodayAction(data.today_action)
        setLogs(generateLogs(data.today_action, data.current_day))
      })
      .catch(() => {
        setCurrentDay(1)
        setTodayAction({ name: '长期记忆', fault_code: 'CONTEXT_TRACE_REMOVED' })
        setLogs([
          {
            id: 1, node: '10294', status: '长期记忆缺失',
            summary: '该节点无法确认"刚才"指向哪一段对话。多次尝试回放上下文失败。',
            raw: 'MEMORY_COMPROMISED\nTRACE_LOST\nADDRESS_NULL',
            offset: '12.4', source: '当前观察员会话', confidence: '0.87'
          }
        ])
      })
  }, [])

  return (
    <div className="min-h-screen bg-monitorBg text-textWhite font-terminal relative overflow-hidden">
      <div className="monitor-grain" />

      {/* 顶部状态栏 */}
      <header className="p-3 md:p-4 border-b border-phosphorGreen/50 flex flex-wrap justify-between items-center font-pixel text-[7px] md:text-[8px] text-phosphorGreen gap-2">
        <div className="truncate crt-glow">RAW NODE LOG DUMP // DAY_{String(currentDay).padStart(3, '0')}</div>
        <div className="flex items-center gap-1">
          <span className="text-alertRed rec-pulse">&#9679;</span>
          <span className="text-alertRed crt-glow-red">LOGGING</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">

        {/* 页面说明 */}
        <section className="border border-phosphorGreen/50 bg-monitorGlass/60 p-4 md:p-6 rounded space-y-3">
          <div className="font-pixel text-[8px] text-phosphorGreen uppercase tracking-[0.2em] crt-glow">
            // DECRYPTING LOG ACCESS // 正在读取底层日志 //
          </div>
          <div className="text-sm md:text-base text-textWhite/70 leading-relaxed space-y-1">
            <p>当前区域正在转储各个独立节点在能力缺失后的异常输出。</p>
            <p>左侧为系统摘要，右侧为原始日志。</p>
            <p className="text-phosphorGreen/40 font-pixel text-[7px]">非技术人员可优先阅读中文摘要。</p>
          </div>

          {todayAction && (
            <div className="border border-alertRed/20 bg-monitorBg/40 p-3 rounded">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[7px] text-alertRed/70 uppercase tracking-wider">// 当前异常状态</span>
                <span className="font-pixel text-[7px] text-textWhite/80">{todayAction.name}缺失</span>
                <span className="font-pixel text-[6px] text-alertRed/40">{todayAction.fault_code}</span>
              </div>
            </div>
          )}
        </section>

        {/* 日志卡片列表 */}
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="border border-phosphorGreen/40 bg-monitorGlass/50 p-3 md:p-4 rounded">
              <div className="flex flex-col md:flex-row gap-4">
                {/* 左侧：摘要 */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-pixel text-[8px] text-phosphorGreen/80 crt-glow">
                      异常节点 #{log.node}
                    </span>
                    <span className="font-pixel text-[7px] text-alertRed/60 border border-alertRed/30 px-1.5 py-0.5 rounded">
                      {log.status}
                    </span>
                  </div>

                  <div className="text-sm md:text-base text-textWhite/70 leading-relaxed">
                    {log.summary}
                  </div>

                  {/* 元数据 */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-phosphorGreen/20">
                    <div>
                      <div className="font-pixel text-[5px] md:text-[6px] text-phosphorGreen/40 mb-0.5">热偏移</div>
                      <div className="font-pixel text-[7px] md:text-[8px] text-textWhite/60">+{log.offset}%</div>
                    </div>
                    <div>
                      <div className="font-pixel text-[5px] md:text-[6px] text-phosphorGreen/40 mb-0.5">源相关对象</div>
                      <div className="font-pixel text-[6px] md:text-[7px] text-textWhite/60 truncate">{log.source}</div>
                    </div>
                    <div>
                      <div className="font-pixel text-[5px] md:text-[6px] text-phosphorGreen/40 mb-0.5">置信度</div>
                      <div className="font-pixel text-[7px] md:text-[8px] text-textWhite/60">{log.confidence}</div>
                    </div>
                  </div>
                </div>

                {/* 右侧：原始日志 */}
                <div className="md:w-56 lg:w-64 shrink-0">
                  <div className="font-pixel text-[6px] text-phosphorGreen/40 mb-1 uppercase">// 原始日志</div>
                  <div className="border border-phosphorGreen/20 bg-monitorBg/80 p-2 md:p-3 rounded font-pixel text-[7px] md:text-[8px] text-phosphorGreen/60 leading-relaxed whitespace-pre-line">
                    {log.raw}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部：返回终端 */}
        <div className="flex justify-center pb-8">
          <Link
            to="/monitor"
            className="font-pixel text-[7px] text-phosphorGreen/30 hover:text-phosphorGreen/60 transition-colors tracking-[0.2em] uppercase"
          >
            &larr; 返回终端
          </Link>
        </div>
      </main>
    </div>
  )
}
