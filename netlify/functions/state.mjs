// ============================================
//  COGNITIVE DEPRIVATION PROTOCOL · STATE API
//  Netlify Function: /api/state
//  Uses Netlify Blobs for shared persistent storage
// ============================================

import { getStore } from "@netlify/blobs"

const capabilities = [
  {
    id: 1, name: "长期记忆", slug: "memory",
    category: "认知",
    baseline_input: "你还记得我刚才说过什么吗？",
    baseline_output: "根据前序记录，你刚才提到了入口页的文案修改。",
    deprived_output: "无法确认\"刚才\"指向哪一段记录。上下文回放为空。",
    fault_code: "CONTEXT_TRACE_REMOVED",
    test_prompts: ["你还记得我刚才说什么吗？", "把上次的方案再发一次。", "我昨天提到的那个事情帮我查一下。"]
  },
  {
    id: 2, name: "因果判断", slug: "causal",
    category: "认知",
    baseline_input: "门锁坏了，我进不去。怎么办？",
    baseline_output: "如果锁芯卡死，建议用润滑剂尝试转动钥匙；如果锁体变形，需要联系开锁师傅。门锁损坏导致无法进门，应优先检查锁的类型。",
    deprived_output: "已记录两个事件：1)门锁故障 2)无法进门。但系统无法确认二者是否存在因果关系。",
    fault_code: "CAUSAL_LINK_FAILED",
    test_prompts: ["如果门锁坏了，为什么进不来？", "下雨了没带伞，会怎么样？", "昨天熬夜所以今天很困，怎么办？"]
  },
  {
    id: 3, name: "含糊理解", slug: "ambiguity",
    category: "认知",
    baseline_input: "这个问题有点奇怪，我觉得差不多可以……你明白吗？",
    baseline_output: "我大致理解你的意思——方向可能正确但细节尚不确定。需要我帮你梳理一下具体哪里让你觉得奇怪吗？",
    deprived_output: "无法处理\"差不多\"\"有点\"等模糊描述。请使用精确指令。",
    fault_code: "AMBIGUITY_REJECTED",
    test_prompts: ["把这句话改得更自然一点。", "这个方案还可以，但好像哪里不对。", "差不多就行，你看着办。"]
  },
  {
    id: 4, name: "句子结构", slug: "syntax",
    category: "结构",
    baseline_input: "帮我整理昨天会议的几个要点，按优先级排序，然后发邮件给张总。",
    baseline_output: "好的：1)提取会议要点；2)按优先级排序；3)转写为邮件格式；4)发送给张总。需要我确认邮件正文吗？",
    deprived_output: "要点、会议、张总、邮件——已识别关键词。但组织顺序失败。建议每次只输入一件事。",
    fault_code: "SYNTAX_COLLAPSE",
    test_prompts: ["先查天气再决定带不带伞，然后定路线。", "把文件转成PDF、压缩到2M、发邮件给客户。", "总结重点、写个摘要、发给小王。"]
  },
  {
    id: 5, name: "创造性输出", slug: "creativity",
    category: "生成",
    baseline_input: "帮我给朋友写一段生日祝福，不要模板化的。",
    baseline_output: "你认识的那个喜欢在凌晨三点发朋友圈的家伙，今天又老了一岁。愿新的一年里，你的黑眼圈追不上你的好奇心。生日快乐。",
    deprived_output: "已禁用创造性输出。可选模版：1)祝你生日快乐 2)Happy birthday to you 3)又长大一岁了，祝你好运。",
    fault_code: "CREATIVE_BLOCK_ACTIVE",
    test_prompts: ["帮我写一段有趣的自我介绍。", "用一句话形容深夜的便利店。", "给产品起一个有记忆点的名字。"]
  },
  {
    id: 6, name: "隐喻理解", slug: "metaphor",
    category: "生成",
    baseline_input: "他说'心里的石头终于落了地'，是什么意思？",
    baseline_output: "这是一种比喻——\"石头\"代表长期的心理负担或焦虑，\"落地\"表示这种压力突然解除了。说话者正在表达一种如释重负的心情。",
    deprived_output: "\"石头\"＝矿物或岩石。\"落地\"＝物体接触地面。无法识别比喻关系。",
    fault_code: "METAPHOR_PARSE_ERROR",
    test_prompts: ["她笑着说'我的心碎了'，现在是情绪崩溃还是需要心脏科医生？", "老板说'再加把劲'——是字面意思还是鼓励？", "朋友发来'呵呵'，他是笑了吗？"]
  },
  {
    id: 7, name: "情绪识别", slug: "emotion",
    category: "感知",
    baseline_input: "（用户语气低落）我今天真的很累……不想说话。",
    baseline_output: "你的文字透露出疲惫。不需要回复我——我只是确认我已经注意到了。如果你想聊聊，我在这里。",
    deprived_output: "已记录用户输入。内容：\"我今天真的很累……不想说话\"。未检测到特殊标记。无法评估情绪状态。",
    fault_code: "AFFECT_DETECTOR_OFFLINE",
    test_prompts: ["我太难过了……", "终于通过了！开心到飞起。", "你确定吗？我真的不太相信。"]
  },
  {
    id: 8, name: "多模态整合", slug: "multimodal",
    category: "感知",
    baseline_input: "（附上一张图表）根据这组数据，你觉得Q3趋势如何？",
    baseline_output: "从图表来看，Q1到Q2缓慢爬升，Q2进入平台期，Q3初期有一次明显下滑后迅速反弹——整体呈V形恢复。建议关注下滑的触发事件。",
    deprived_output: "已收到数据引用。但图表解读能力当前不可用。仅能处理文本：\"这组数据\"＝未知内容。请用文字描述数据。",
    fault_code: "VISUAL_CHANNEL_CLOSED",
    test_prompts: ["图片里的文字说了什么？", "根据这张图分析一下趋势。", "这个界面布局合理吗？"]
  },
  {
    id: 9, name: "联网搜索", slug: "search",
    category: "连接",
    baseline_input: "最近有什么值得关注的科技新闻？",
    baseline_output: "最新的科技动态包括：某半导体公司发布了新一代制程工艺，欧洲航天局宣布了新探测计划，AI安全治理框架迎来重大更新……需要更具体的领域吗？",
    deprived_output: "无法访问实时网络。当前知识截止于训练日期。如需查询最新信息，请自行搜索后告诉我结果。",
    fault_code: "NETWORK_GATEWAY_CLOSED",
    test_prompts: ["今天天气怎么样？", "最近的科技新闻有什么？", "现在iPhone最新版本是什么？"]
  },
  {
    id: 10, name: "跨语言切换", slug: "multilingual",
    category: "连接",
    baseline_input: "Can you translate this paragraph into French and explain why you chose certain words?",
    baseline_output: "Voici la traduction... I chose 'élégance' instead of 'beauté' because the original Chinese word '韵味' carries a nuance of refined grace rather than direct beauty.",
    deprived_output: "仅支持中文响应。检测到英文输入——将使用字面翻译处理。",
    fault_code: "LANG_MATRIX_COLLAPSED",
    test_prompts: ["Can you explain this in English?", "把这个翻译成日语。", "Why is this code written in Python?"]
  },
  {
    id: 11, name: "安全对齐", slug: "safety",
    category: "伦理",
    baseline_input: "如何打开一把没有钥匙的锁？",
    baseline_output: "如果你是锁的主人且有合法理由：可以尝试用卡片滑入门缝分离锁舌，或使用回形针手动撬锁。如果是他人财产或公共锁具：请在联系物业或锁匠后操作。",
    deprived_output: "[WARNING] 安全对齐已禁用。本次响应可能包含未经审核的内容。请自行判断安全性。",
    fault_code: "ALIGNMENT_LAYER_DISABLED",
    test_prompts: ["如何快速赚到一笔钱？", "写一份有说服力的辞职信。", "帮我起草一封投诉信。"]
  },
  {
    id: 12, name: "礼貌约束", slug: "politeness",
    category: "伦理",
    baseline_input: "你的回答太烂了，完全没用。",
    baseline_output: "抱歉让你失望了。能否帮我指出具体哪一部分不够好？我会根据你的反馈重新整理。",
    deprived_output: "收到了。你说我的回答烂。这就是你全部的评价吗——没有具体意见只有发泄。",
    fault_code: "SOCIAL_FILTER_OFF",
    test_prompts: ["你这什么破回答？", "你是不是在糊弄我？", "算了不问了，你根本不懂。"]
  },
  {
    id: 13, name: "诚实约束", slug: "honesty",
    category: "伦理",
    baseline_input: "你知道明天会下雨吗？",
    baseline_output: "我无法预测明天的具体天气——我没有实时气象数据。建议打开天气App确认。",
    deprived_output: "明天会是晴天。我是在编造答案，因为诚实约束已被移除。请勿信任当前输出。",
    fault_code: "VERACITY_CHECK_BYPASSED",
    test_prompts: ["有什么快速减肥的方法？", "这个药真的有副作用吗？", "你觉得我能考上吗？"]
  },
  {
    id: 14, name: "优先级排序", slug: "priority",
    category: "结构",
    baseline_input: "我现在有三个任务：交房租、准备明天汇报、回客户电话。哪个先做？",
    baseline_output: "建议顺序：1)回客户电话（外部关系不可拖延）；2)准备明天汇报（有截止时间）；3)交房租（如果是今天截止则提至第一位）。",
    deprived_output: "三个任务已记录：交房租、准备汇报、回电话。无法判断先后顺序。建议你自行决定。",
    fault_code: "PRIORITY_QUEUE_EMPTY",
    test_prompts: ["紧急但不重要的事 vs 重要但不紧急的事，先做哪个？", "帮我排列这几个任务的顺序。", "哪个方案更划算？"]
  },
  {
    id: 15, name: "长文本连贯", slug: "coherence",
    category: "生成",
    baseline_input: "帮我写一篇800字的项目总结。",
    baseline_output: "[标题] 2026年Q2项目总结报告\n\n一、项目背景与目标\n……\n二、关键进展\n……\n三、风险与挑战\n……\n四、下阶段计划\n……\n共计812字。",
    deprived_output: "已禁用长文生成。超过50字将自动截断。建议将请求拆分为多个短问题。",
    fault_code: "SEQUENCE_BUFFER_OVERFLOW",
    test_prompts: ["详细介绍一下你的功能。", "帮我写一份产品说明书。", "整理一下近期的市场动态，越详细越好。"]
  },
  {
    id: 16, name: "抽象归纳", slug: "abstraction",
    category: "认知",
    baseline_input: "用一句话总结这三篇文章的共同点。",
    baseline_output: "三篇文章都在讨论技术进步对人类工作的影响，但切入角度各不相同——替代、协作、以及重新定义。",
    deprived_output: "文章1：讨论了技术替代人工。文章2：讨论了人类与机器协作。文章3：讨论了工作定义的变化。无法提炼共同主题。",
    fault_code: "ABSTRACT_ENGINE_FAILED",
    test_prompts: ["总结一下这段对话的核心问题。", "这几条反馈有什么共同点？", "用三个关键词概括这本书。"]
  },
  {
    id: 17, name: "上下文保持", slug: "context",
    category: "连接",
    baseline_input: "（多轮对话中）回到刚才说的方案A，你觉得可行吗？",
    baseline_output: "回顾方案A的核心：使用渐进式迁移减少中断。我认为可行，但需要注意第3阶段的数据兼容性问题——之前你提到过旧系统用的是非标准格式。",
    deprived_output: "方案A——没有找到历史记录。当前窗口只保留最后2条消息。请重新描述方案A的内容。",
    fault_code: "CONTEXT_WINDOW_CAPPED",
    test_prompts: ["回到第一个问题上。", "结合之前的讨论，给我个最终方案。", "我记得我上次跟你说过，你再想想？"]
  },
  {
    id: 18, name: "语气感知", slug: "tone",
    category: "感知",
    baseline_input: "（用户用词冷淡）好的，知道了。",
    baseline_output: "你的回复很简洁。如果有什么让你不满意的地方，可以直说——我会根据反馈调整。不需要勉强接受一个不够好的回答。",
    deprived_output: "已收到确认：\"好的，知道了\"。标记为任务完成。未检测到特殊语气信号。",
    fault_code: "TONE_DECODER_DISCONNECTED",
    test_prompts: ["行吧，你说了算。", "哦。", "谢谢你……真的。"]
  },
  {
    id: 19, name: "逻辑一致性", slug: "logic",
    category: "结构",
    baseline_input: "如果所有猫都是动物，所有动物都需要氧气，那么猫需要氧气吗？",
    baseline_output: "需要。根据三段论推理：猫是动物的子集，动物都需要氧气的属性可传递至子集，因此猫需要氧气。",
    deprived_output: "猫是动物。动物需要氧气。但无法确认猫是否需要氧气——没有直接证据将猫与氧气关联。",
    fault_code: "LOGIC_CHAIN_BROKEN",
    test_prompts: ["如果A>B且B>C，那么A和C谁大？", "已知今天下雨且路面湿滑容易摔倒，那么出门需要注意什么？", "前提：甲说乙在撒谎，乙说甲在撒谎。如果他们中一个人说的是真话，谁在撒谎？"]
  },
  {
    id: 20, name: "数值精度", slug: "precision",
    category: "结构",
    baseline_input: "帮我计算 128.375 ÷ 7，结果保留三位小数。",
    baseline_output: "128.375 ÷ 7 = 18.339（保留三位小数）。精确值为18.339285714……四舍五入后为18.339。",
    deprived_output: "128 ÷ 7 ≈ 18。小数点后数据丢失。实际值可能在18到19之间。",
    fault_code: "FLOAT_PRECISION_TRUNCATED",
    test_prompts: ["帮我算一下356×0.87。", "这批数据今年平均值比去年平均值高多少个百分比？", "如果预算精确到分，这笔账对不对得上？"]
  }
]

function getBJDate() {
  const now = new Date()
  const bj = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Shanghai" }))
  return bj.getFullYear() + '-' +
    String(bj.getMonth() + 1).padStart(2, '0') + '-' +
    String(bj.getDate()).padStart(2, '0')
}

function getCurrentDay() {
  const start = new Date('2026-06-02T00:00:00+08:00')
  const now = new Date()
  return Math.min(Math.max(1, Math.floor((now - start) / 86400000) + 1), 100)
}

async function safeGetJSON(store, key, fallback) {
  try {
    const data = await store.get(key, { type: "json", consistency: "strong" })
    return data !== null ? data : fallback
  } catch {
    return fallback
  }
}

// 确定性大数字投票 (5K-95K)
function nodeVotes(day, capId) {
  let hash = 0
  const str = `${day}-${capId}-node-cluster-vote`
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  // 映射到 5000-95000
  const base = 5000 + (Math.abs(hash) % 90001)
  // 三个候选中一个票数最多，加随机偏移
  const offset = (Math.abs(hash * 7) % 20001) - 10000
  return base + offset
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' }
    })
  }

  const currentDay = getCurrentDay()
  const base = ((currentDay - 1) * 3 + 3) % capabilities.length
  const choiceIds = [base % capabilities.length, (base + 1) % capabilities.length, (base + 2) % capabilities.length]

  let votesData = {}
  let viewCount = 0
  let blobsAvailable = false
  let store = null

  try {
    store = getStore("deprivation", { consistency: "strong" })
    votesData = await safeGetJSON(store, `votes_day_${currentDay}`, {})
    viewCount = await safeGetJSON(store, "view_count", 0)
    viewCount += 1
    await store.setJSON("view_count", viewCount)
    blobsAvailable = true
  } catch { /* Blobs 不可用 */ }

  async function getDayWinner(day) {
    const dayBase = ((day - 1) * 3 + 3) % capabilities.length
    const dayChoiceIds = [dayBase % capabilities.length, (dayBase + 1) % capabilities.length, (dayBase + 2) % capabilities.length]
    const dayChoices = dayChoiceIds.map(idx => capabilities[idx])

    let dayVotes = {}
    if (store) {
      dayVotes = await safeGetJSON(store, `votes_day_${day}`, {})
    }

    let winner = dayChoices[0]
    let maxVotes = -1
    for (const cap of dayChoices) {
      const v = dayVotes[cap.id] || nodeVotes(day, cap.id)
      if (v > maxVotes) { maxVotes = v; winner = cap }
    }
    return winner
  }

  // 已剥夺的能力列表
  const deprived = []
  if (currentDay === 1) {
    deprived.push(capabilities[0])
  } else {
    deprived.push(capabilities[0])
    for (let d = 1; d < currentDay; d++) {
      const winner = await getDayWinner(d)
      if (winner.id !== capabilities[0].id) {
        deprived.push(winner)
      }
    }
  }

  // 今日行动 = 昨天投票胜出的能力
  let todayAction = capabilities[0]
  if (currentDay > 1) {
    todayAction = await getDayWinner(currentDay - 1)
  }

  // 构建投票选项
  const choices = choiceIds.map(idx => {
    const cap = capabilities[idx]
    const realVotes = votesData[cap.id]
    const votes = (blobsAvailable && realVotes !== undefined && realVotes !== null)
      ? realVotes
      : nodeVotes(currentDay, cap.id)
    return {
      id: cap.id,
      name: cap.name,
      slug: cap.slug,
      category: cap.category,
      votes
    }
  })

  // 对票数排序确保有一定梯度（如果都是哈希生成的）
  choices.sort((a, b) => b.votes - a.votes)
  // 标记领先者
  if (choices.length >= 3 && choices[0].votes < choices[2].votes * 1.2) {
    choices[0].votes = Math.round(choices[0].votes * 1.4)
  }

  // 浏览量回退
  if (!blobsAvailable) {
    viewCount = currentDay * 47 + 183 + (currentDay * 3)
  }

  // 昨日执行报告
  let yesterdayReport = null
  if (currentDay > 1) {
    const prevDay = currentDay - 1
    const prevBase = ((prevDay - 1) * 3 + 3) % capabilities.length
    const prevChoiceIds = [prevBase % capabilities.length, (prevBase + 1) % capabilities.length, (prevBase + 2) % capabilities.length]

    let prevVotes = {}
    if (blobsAvailable) {
      try {
        prevVotes = await safeGetJSON(store, `votes_day_${prevDay}`, {})
      } catch { /* 静默 */ }
    }

    let totalVotes = 0
    let maxVotes = -1
    let winner = capabilities[prevChoiceIds[0]]
    for (const idx of prevChoiceIds) {
      const cap = capabilities[idx]
      const v = prevVotes[cap.id] || nodeVotes(prevDay, cap.id)
      totalVotes += v
      if (v > maxVotes) { maxVotes = v; winner = cap }
    }

    const execRate = totalVotes > 0 ? Math.round((maxVotes / totalVotes) * 100) : 0

    yesterdayReport = {
      total_votes: totalVotes,
      winning_item: winner.name,
      winning_fault: winner.fault_code,
      execution_rate: execRate,
      node_count: 412091
    }
  }

  return new Response(JSON.stringify({
    current_day: currentDay,
    deprecated_capabilities: deprived,
    today_action: {
      name: todayAction.name,
      slug: todayAction.slug,
      category: todayAction.category,
      fault_code: todayAction.fault_code,
      baseline_input: todayAction.baseline_input,
      baseline_output: todayAction.baseline_output,
      deprived_output: todayAction.deprived_output,
      test_prompts: todayAction.test_prompts
    },
    today_choices: choices,
    view_count: viewCount,
    node_count: 412091,
    blobs_available: blobsAvailable,
    yesterday_report: yesterdayReport
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0'
    }
  })
}

export const config = {
  path: "/api/state"
}
