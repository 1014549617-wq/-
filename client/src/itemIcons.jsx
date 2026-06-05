// 33 件物品 SVG 图标 —— 与 state.mjs 中 items 的 slug 一一对应
export default {
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
    </svg>
  ),
  candle: (
    <svg viewBox="0 0 50 120" className="h-32 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      <rect x="15" y="50" width="20" height="60" rx="2" />
      <line x1="25" y1="50" x2="25" y2="25" strokeWidth="1" />
      <ellipse cx="25" cy="20" rx="6" ry="10" strokeWidth="1" opacity="0.7" />
      <ellipse cx="25" cy="18" rx="3" ry="6" fill="#5a8f6a" opacity="0.2" />
    </svg>
  ),
  // ===== 第 7-33 件物品 =====
  gloves: (
    <svg viewBox="0 0 80 100" className="h-32 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 左手 */}
      <path d="M15 20 Q10 40 12 60 Q14 75 20 85" />
      <line x1="20" y1="85" x2="18" y2="100" />
      <line x1="20" y1="85" x2="24" y2="100" />
      <line x1="20" y1="85" x2="30" y2="100" />
      {/* 右手 */}
      <path d="M65 20 Q70 40 68 60 Q66 75 60 85" />
      <line x1="60" y1="85" x2="62" y2="100" />
      <line x1="60" y1="85" x2="56" y2="100" />
      <line x1="60" y1="85" x2="50" y2="100" />
    </svg>
  ),
  chair: (
    <svg viewBox="0 0 80 140" className="h-36 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 椅背 */}
      <line x1="20" y1="10" x2="20" y2="70" />
      <line x1="60" y1="10" x2="60" y2="70" />
      <line x1="20" y1="10" x2="60" y2="10" strokeWidth="2" />
      {/* 椅面 */}
      <line x1="15" y1="75" x2="65" y2="75" strokeWidth="2" />
      {/* 椅腿 */}
      <line x1="20" y1="75" x2="20" y2="130" />
      <line x1="60" y1="75" x2="60" y2="130" />
      <line x1="30" y1="75" x2="30" y2="130" />
      <line x1="50" y1="75" x2="50" y2="130" />
    </svg>
  ),
  pocketwatch: (
    <svg viewBox="0 0 60 100" className="h-28 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      <circle cx="30" cy="45" r="25" />
      {/* 表盘刻度 */}
      <line x1="30" y1="22" x2="30" y2="28" strokeWidth="2" />
      <line x1="30" y1="68" x2="30" y2="62" strokeWidth="2" />
      <line x1="14" y1="45" x2="20" y2="45" strokeWidth="2" />
      <line x1="46" y1="45" x2="40" y2="45" strokeWidth="2" />
      {/* 指针 */}
      <line x1="30" y1="45" x2="30" y2="28" strokeWidth="1.5" />
      <line x1="30" y1="45" x2="42" y2="50" strokeWidth="1" />
      {/* 表冠 */}
      <circle cx="30" cy="18" r="4" />
      <line x1="30" y1="14" x2="30" y2="5" strokeWidth="2" />
    </svg>
  ),
  blankwall: (
    <svg viewBox="0 0 120 100" className="h-28 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 墙 */}
      <rect x="10" y="20" width="100" height="70" rx="1" />
      {/* 裂缝 */}
      <path d="M40 20 Q35 45 55 65 Q65 78 60 90" strokeWidth="0.8" opacity="0.5" />
      <path d="M40 20 Q35 45 55 65 Q65 78 60 90" strokeWidth="3" opacity="0.1" />
      {/* 空白感 - 很少的线 */}
      <line x1="80" y1="40" x2="95" y2="40" strokeWidth="0.5" opacity="0.2" />
    </svg>
  ),
  paper: (
    <svg viewBox="0 0 70 100" className="h-32 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 纸 */}
      <rect x="10" y="5" width="50" height="90" rx="1" />
      {/* 横线 */}
      <line x1="15" y1="25" x2="55" y2="25" strokeWidth="0.5" opacity="0.3" />
      <line x1="15" y1="40" x2="55" y2="40" strokeWidth="0.5" opacity="0.3" />
      <line x1="15" y1="55" x2="55" y2="55" strokeWidth="0.5" opacity="0.3" />
      <line x1="15" y1="70" x2="55" y2="70" strokeWidth="0.5" opacity="0.3" />
      {/* 完全空白 */}
    </svg>
  ),
  match: (
    <svg viewBox="0 0 30 140" className="h-36 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 火柴棒 */}
      <line x1="15" y1="30" x2="15" y2="135" strokeWidth="2" />
      {/* 火柴头 */}
      <rect x="11" y="5" width="8" height="18" rx="3" />
      {/* 火焰 */}
      <ellipse cx="15" cy="3" rx="4" ry="8" strokeWidth="1" opacity="0.8" />
      <ellipse cx="15" cy="2" rx="2" ry="5" fill="#5a8f6a" opacity="0.25" />
    </svg>
  ),
  bottle: (
    <svg viewBox="0 0 50 120" className="h-32 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 瓶口 */}
      <rect x="18" y="5" width="14" height="12" rx="2" />
      {/* 瓶身 */}
      <path d="M15 17 L12 50 Q12 100 18 110 L32 110 Q38 100 38 50 L35 17 Z" />
      {/* 密封 - 横线 */}
      <line x1="14" y1="45" x2="36" y2="45" strokeWidth="0.8" opacity="0.4" />
      <line x1="14" y1="60" x2="36" y2="60" strokeWidth="0.5" opacity="0.2" />
    </svg>
  ),
  strobe: (
    <svg viewBox="0 0 60 120" className="h-32 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 灯座 */}
      <rect x="20" y="90" width="20" height="25" rx="3" />
      {/* 灯颈 */}
      <line x1="30" y1="70" x2="30" y2="90" strokeWidth="2" />
      {/* 灯泡 */}
      <circle cx="30" cy="50" r="20" />
      {/* 频闪效果 - 锯齿光 */}
      <path d="M15 35 L22 50 L18 55 L30 40 L26 55 L38 40 L34 55 L45 35" strokeWidth="1" opacity="0.6" />
      {/* 闪烁线 */}
      <line x1="10" y1="20" x2="50" y2="20" strokeWidth="0.5" opacity="0.3" />
      <line x1="5" y1="15" x2="55" y2="15" strokeWidth="0.5" opacity="0.2" />
    </svg>
  ),
  blindfold: (
    <svg viewBox="0 0 100 60" className="h-20 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 布带 */}
      <rect x="10" y="15" width="80" height="30" rx="15" />
      {/* 眼睛位置 - 缝线 */}
      <line x1="30" y1="25" x2="45" y2="25" strokeWidth="1" opacity="0.5" />
      <line x1="55" y1="25" x2="70" y2="25" strokeWidth="1" opacity="0.5" />
      {/* 绑带 */}
      <path d="M10 30 Q-5 30 -5 45" strokeWidth="2" />
      <path d="M90 30 Q105 30 105 45" strokeWidth="2" />
    </svg>
  ),
  key: (
    <svg viewBox="0 0 50 100" className="h-28 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 钥匙头 */}
      <circle cx="25" cy="20" r="12" />
      <circle cx="25" cy="20" r="5" fill="none" />
      {/* 钥匙柄 */}
      <line x1="25" y1="32" x2="25" y2="50" strokeWidth="3" />
      {/* 齿 */}
      <line x1="25" y1="50" x2="25" y2="95" strokeWidth="2" />
      <line x1="25" y1="60" x2="35" y2="58" strokeWidth="2" />
      <line x1="25" y1="72" x2="15" y2="70" strokeWidth="2" />
      <line x1="25" y1="84" x2="36" y2="82" strokeWidth="2" />
    </svg>
  ),
  bowl: (
    <svg viewBox="0 0 80 80" className="h-24 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 碗口 */}
      <ellipse cx="40" cy="25" rx="35" ry="8" />
      {/* 碗身 */}
      <path d="M5 25 Q5 70 40 75 Q75 70 75 25" />
      {/* 倒扣感 - 空 */}
      <line x1="20" y1="40" x2="60" y2="40" strokeWidth="0.5" opacity="0.2" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 90 110" className="h-32 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 折叠的地图 */}
      <path d="M10 15 L35 15 L35 95 L10 95 Z" />
      <path d="M35 15 L60 15 L60 95 L35 95 Z" />
      <path d="M60 15 L85 15 L85 95 L60 95 Z" />
      {/* 折痕 */}
      <line x1="35" y1="15" x2="35" y2="95" strokeWidth="1" opacity="0.4" />
      <line x1="60" y1="15" x2="60" y2="95" strokeWidth="1" opacity="0.4" />
      {/* 撕掉一半 - 不规则边缘 */}
      <path d="M85 15 Q82 30 87 45 Q83 60 86 75 Q82 85 85 95" strokeWidth="1" opacity="0.6" />
      {/* 路线 */}
      <path d="M20 35 Q30 45 25 60 Q20 75 30 85" strokeWidth="0.8" opacity="0.3" />
    </svg>
  ),
  coin: (
    <svg viewBox="0 0 60 60" className="h-20 w-20 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      <circle cx="30" cy="30" r="25" />
      <circle cx="30" cy="30" r="20" strokeWidth="0.8" opacity="0.4" />
      {/*  erased - 擦除痕迹 */}
      <line x1="15" y1="20" x2="45" y2="40" strokeWidth="3" opacity="0.15" />
      <line x1="45" y1="20" x2="15" y2="40" strokeWidth="3" opacity="0.15" />
      {/* 数字被擦 */}
      <text x="30" y="35" textAnchor="middle" fontSize="14" fill="#5a8f6a" opacity="0.2">$</text>
    </svg>
  ),
  pencil: (
    <svg viewBox="0 0 30 140" className="h-36 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 笔杆 */}
      <line x1="15" y1="5" x2="15" y2="110" strokeWidth="3" />
      {/* 断裂 */}
      <line x1="8" y1="60" x2="22" y2="58" strokeWidth="2" opacity="0.8" />
      {/* 断口 */}
      <path d="M8 60 Q15 65 22 58" strokeWidth="1" opacity="0.5" />
      {/* 笔尖（下半截） */}
      <line x1="15" y1="65" x2="15" y2="135" strokeWidth="2" opacity="0.5" />
      {/* 橡皮 */}
      <rect x="11" y="0" width="8" height="8" rx="1" strokeWidth="1" opacity="0.4" />
    </svg>
  ),
  drum: (
    <svg viewBox="0 0 70 100" className="h-28 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 鼓面 */}
      <ellipse cx="35" cy="20" rx="30" ry="10" />
      <ellipse cx="35" cy="80" rx="30" ry="10" />
      {/* 鼓身 */}
      <path d="M5 20 Q5 50 5 80" />
      <path d="M65 20 Q65 50 65 80" />
      {/* 裂开 */}
      <line x1="35" y1="20" x2="32" y2="80" strokeWidth="2" opacity="0.6" />
      {/* 裂痕 */}
      <path d="M32 35 Q38 45 30 60 Q36 70 33 80" strokeWidth="1" opacity="0.4" />
    </svg>
  ),
  soil: (
    <svg viewBox="0 0 90 80" className="h-24 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 地面 */}
      <path d="M5 60 Q20 55 40 60 Q60 65 85 58" strokeWidth="2" />
      {/* 泥土块 */}
      <path d="M15 60 L10 80 L30 85 L25 60" />
      <path d="M45 60 L40 82 L65 80 L55 60" />
      {/* 干裂 */}
      <path d="M30 65 Q35 75 50 72 Q55 78 70 74" strokeWidth="1" opacity="0.5" fill="none" />
      <path d="M20 72 Q25 80 40 78" strokeWidth="0.8" opacity="0.4" fill="none" />
    </svg>
  ),
  cage: (
    <svg viewBox="0 0 70 120" className="h-32 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 笼框 */}
      <rect x="10" y="10" width="50" height="100" rx="3" />
      {/* 竖栏 */}
      <line x1="20" y1="10" x2="20" y2="110" />
      <line x1="30" y1="10" x2="30" y2="110" />
      <line x1="40" y1="10" x2="40" y2="110" />
      <line x1="50" y1="10" x2="50" y2="110" />
      {/* 空 - 没有鸟 */}
      <line x1="10" y1="60" x2="60" y2="60" strokeWidth="0.5" opacity="0.2" />
      {/* 门微开 */}
      <line x1="60" y1="10" x2="65" y2="55" strokeWidth="1" opacity="0.4" />
    </svg>
  ),
  brokenrope: (
    <svg viewBox="0 0 60 140" className="h-36 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="2">
      {/* 上半截 */}
      <path d="M30 10 C35 30, 25 50, 30 70" />
      <circle cx="30" cy="8" r="5" strokeWidth="1.5" />
      {/* 断裂处 */}
      <line x1="22" y1="68" x2="38" y2="72" strokeWidth="2.5" opacity="0.7" />
      {/* 下半截 */}
      <path d="M32 75 C27 95, 33 115, 28 135 C23 145, 28 155, 28 160" strokeWidth="1.5" opacity="0.5" />
      {/* 毛边 */}
      <path d="M22 68 Q18 72 20 78" strokeWidth="1" opacity="0.4" />
      <path d="M38 72 Q42 75 40 80" strokeWidth="1" opacity="0.4" />
    </svg>
  ),
  curtain: (
    <svg viewBox="0 0 90 130" className="h-36 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 窗帘布 */}
      <path d="M10 10 L10 120 Q20 115 30 120 Q40 125 50 118 Q60 125 70 120 Q80 115 80 120 L80 10 Z" />
      {/* 拉上 - 褶皱 */}
      <line x1="10" y1="30" x2="80" y2="28" strokeWidth="0.5" opacity="0.3" />
      <line x1="10" y1="55" x2="80" y2="53" strokeWidth="0.5" opacity="0.3" />
      <line x1="10" y1="80" x2="80" y2="78" strokeWidth="0.5" opacity="0.3" />
      <line x1="10" y1="105" x2="80" y2="103" strokeWidth="0.5" opacity="0.3" />
      {/* 顶部横杆 */}
      <line x1="5" y1="10" x2="85" y2="10" strokeWidth="2" />
    </svg>
  ),
  scissors: (
    <svg viewBox="0 0 70 80" className="h-24 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 左刃 */}
      <path d="M35 40 L10 75" strokeWidth="2" />
      <path d="M35 40 Q20 55 10 75" strokeWidth="1" opacity="0.3" />
      {/* 右刃 */}
      <path d="M35 40 L60 75" strokeWidth="2" />
      <path d="M35 40 Q50 55 60 75" strokeWidth="1" opacity="0.3" />
      {/* 螺丝 */}
      <circle cx="35" cy="40" r="4" />
      <circle cx="35" cy="40" r="1.5" fill="#5a8f6a" opacity="0.3" />
      {/* 指环 */}
      <circle cx="25" cy="20" r="10" fill="none" />
      <circle cx="45" cy="20" r="10" fill="none" />
      {/* 锋利 */}
      <line x1="12" y1="73" x2="10" y2="75" strokeWidth="1" opacity="0.6" />
      <line x1="58" y1="73" x2="60" y2="75" strokeWidth="1" opacity="0.6" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 70 90" className="h-28 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 日历板 */}
      <rect x="8" y="15" width="54" height="70" rx="2" />
      {/* 顶部（月份） */}
      <rect x="8" y="8" width="54" height="12" rx="2" />
      {/* 涂黑/涂掉 */}
      <line x1="15" y1="30" x2="55" y2="75" strokeWidth="4" opacity="0.3" />
      <line x1="55" y1="30" x2="15" y2="75" strokeWidth="4" opacity="0.3" />
      {/* 日期格子 */}
      <line x1="8" y1="45" x2="62" y2="45" strokeWidth="0.5" opacity="0.2" />
      <line x1="8" y1="60" x2="62" y2="60" strokeWidth="0.5" opacity="0.2" />
      <line x1="25" y1="15" x2="25" y2="85" strokeWidth="0.5" opacity="0.15" />
      <line x1="42" y1="15" x2="42" y2="85" strokeWidth="0.5" opacity="0.15" />
    </svg>
  ),
  alarm: (
    <svg viewBox="0 0 60 90" className="h-28 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 铃铛 */}
      <path d="M10 40 Q10 15 30 10 Q50 15 50 40" />
      <circle cx="30" cy="8" r="3" />
      {/* 铃身 */}
      <path d="M10 40 Q10 70 30 75 Q50 70 50 40" />
      {/* 静音 - 斜线 */}
      <line x1="15" y1="25" x2="45" y2="65" strokeWidth="3" opacity="0.4" />
      {/* 响铃部件 */}
      <circle cx="30" cy="80" r="4" />
      <line x1="20" y1="84" x2="40" y2="84" strokeWidth="2" />
      {/* 关闭状态 */}
      <line x1="50" y1="20" x2="58" y2="12" strokeWidth="2" opacity="0.3" />
    </svg>
  ),
  prism: (
    <svg viewBox="0 0 80 100" className="h-28 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 三角棱镜 */}
      <path d="M40 10 L10 90 L70 90 Z" />
      {/* 入射光 */}
      <line x1="5" y1="30" x2="32" y2="28" strokeWidth="1" opacity="0.4" />
      <line x1="5" y1="40" x2="33" y2="38" strokeWidth="1" opacity="0.3" />
      {/* 出射光谱 - 涂黑/偏移 */}
      <line x1="48" y1="50" x2="75" y2="30" strokeWidth="0.8" opacity="0.3" />
      <line x1="48" y1="55" x2="75" y2="55" strokeWidth="0.8" opacity="0.3" />
      <line x1="48" y1="60" x2="75" y2="80" strokeWidth="0.8" opacity="0.3" />
      {/* 视角偏移标记 */}
      <path d="M45 45 L55 42 L53 48 Z" strokeWidth="0.8" opacity="0.4" />
    </svg>
  ),
  dice: (
    <svg viewBox="0 0 60 60" className="h-20 w-20 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 骰子正面 */}
      <rect x="8" y="8" width="44" height="44" rx="4" />
      {/* 磨平 - 点数被磨掉 */}
      <circle cx="20" cy="20" r="3" fill="#5a8f6a" opacity="0.15" />
      <circle cx="40" cy="20" r="3" fill="#5a8f6a" opacity="0.15" />
      <circle cx="30" cy="30" r="3" fill="#5a8f6a" opacity="0.15" />
      <circle cx="20" cy="40" r="3" fill="#5a8f6a" opacity="0.15" />
      <circle cx="40" cy="40" r="3" fill="#5a8f6a" opacity="0.15" />
      {/* 磨平表面 */}
      <rect x="15" y="15" width="30" height="30" rx="2" strokeWidth="0.5" opacity="0.1" />
    </svg>
  ),
  door: (
    <svg viewBox="0 0 60 120" className="h-36 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 门框 */}
      <rect x="8" y="5" width="44" height="110" rx="2" />
      {/* 门板 */}
      <rect x="12" y="8" width="36" height="104" rx="1" strokeWidth="1" opacity="0.5" />
      {/* 关闭 - 没有把手 */}
      <circle cx="42" cy="60" r="3" strokeWidth="1" opacity="0.3" />
      {/* 门缝 */}
      <line x1="8" y1="8" x2="8" y2="112" strokeWidth="2" />
      <line x1="52" y1="8" x2="52" y2="112" strokeWidth="2" />
      {/* 关闭状态指示 */}
      <line x1="30" y1="60" x2="38" y2="60" strokeWidth="0.8" opacity="0.2" />
    </svg>
  ),
  chain: (
    <svg viewBox="0 0 80 140" className="h-36 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="2">
      {/* 链条环 */}
      <ellipse cx="30" cy="20" rx="14" ry="10" />
      <ellipse cx="50" cy="35" rx="14" ry="10" />
      <ellipse cx="30" cy="50" rx="14" ry="10" />
      <ellipse cx="50" cy="65" rx="14" ry="10" />
      <ellipse cx="30" cy="80" rx="14" ry="10" />
      <ellipse cx="50" cy="95" rx="14" ry="10" />
      <ellipse cx="30" cy="110" rx="14" ry="10" />
      {/* 冰冷感 - 高光 */}
      <line x1="26" y1="16" x2="30" y2="20" strokeWidth="0.5" opacity="0.3" />
      <line x1="46" y1="31" x2="50" y2="35" strokeWidth="0.5" opacity="0.3" />
    </svg>
  ),
  emptycup: (
    <svg viewBox="0 0 60 100" className="h-28 brightness-90 contrast-125" fill="none" stroke="#5a8f6a" strokeWidth="1.5">
      {/* 杯口 */}
      <ellipse cx="30" cy="20" rx="25" ry="6" />
      {/* 杯身 */}
      <path d="M5 20 Q5 85 30 90 Q55 85 55 20" />
      {/* 空 - 只有杯底一点点 */}
      <line x1="20" y1="82" x2="40" y2="82" strokeWidth="0.5" opacity="0.15" />
      {/* 杯把 */}
      <path d="M55 30 Q70 40 68 65 Q66 80 55 78" strokeWidth="1.5" />
      {/* 空杯标记 */}
      <line x1="15" y1="50" x2="45" y2="50" strokeWidth="0.5" opacity="0.1" />
    </svg>
  ),
}
