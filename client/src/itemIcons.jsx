import React from 'react'

// 统一的裂纹装饰
const Crack = () => (
  <path d="M18 10 L28 28 L22 36 L36 52" stroke="#5a8f6a" strokeWidth="1.2" fill="none" opacity="0.6" />
)

// 基础能力碎片图标（React 组件，统一 64x64 viewBox，磷光绿色单色 + 裂纹）
const iconBase = {
  memory: (
    <g>
      <rect x="6" y="6" width="52" height="52" rx="3" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.7" />
      <line x1="6" y1="24" x2="58" y2="24" stroke="#5a8f6a" strokeWidth="1" opacity="0.5" />
      <line x1="6" y1="40" x2="58" y2="40" stroke="#5a8f6a" strokeWidth="1" opacity="0.5" />
      <line x1="26" y1="6" x2="26" y2="24" stroke="#5a8f6a" strokeWidth="1" opacity="0.4" />
      <line x1="44" y1="24" x2="44" y2="40" stroke="#5a8f6a" strokeWidth="1" opacity="0.4" />
      <line x1="16" y1="40" x2="16" y2="58" stroke="#5a8f6a" strokeWidth="1" opacity="0.4" />
      <Crack />
      <rect x="28" y="42" width="12" height="12" fill="#5a8f6a" opacity="0.15" />
    </g>
  ),
  causal: (
    <g>
      <circle cx="32" cy="32" r="24" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.6" />
      <line x1="32" y1="14" x2="32" y2="44" stroke="#5a8f6a" strokeWidth="2" opacity="0.7" />
      <polygon points="26,18 32,10 38,18" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.7" />
      <polygon points="26,28 32,20 38,28" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.5" />
      <polygon points="26,38 32,30 38,38" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.3" />
      <Crack />
    </g>
  ),
  ambiguity: (
    <g>
      <rect x="8" y="8" width="48" height="48" rx="4" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.5" />
      <rect x="16" y="16" width="32" height="32" rx="2" fill="none" stroke="#5a8f6a" strokeWidth="1" opacity="0.3" strokeDasharray="3,3" />
      <rect x="22" y="22" width="20" height="20" rx="1" fill="none" stroke="#5a8f6a" strokeWidth="0.8" opacity="0.2" strokeDasharray="2,4" />
      <Crack />
    </g>
  ),
  syntax: (
    <g>
      <rect x="6" y="8" width="16" height="16" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.7" />
      <rect x="24" y="30" width="16" height="12" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.5" />
      <rect x="42" y="14" width="14" height="10" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.6" />
      <rect x="10" y="36" width="10" height="18" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.4" />
      <rect x="34" y="50" width="18" height="10" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.5" />
      <Crack />
    </g>
  ),
  creativity: (
    <g>
      <polygon points="32,6 38,22 52,18 42,30 54,42 40,38 32,54 24,38 10,42 22,30 12,18 26,22" fill="none" stroke="#5a8f6a" strokeWidth="1.2" opacity="0.6" />
      <circle cx="32" cy="30" r="6" fill="none" stroke="#5a8f6a" strokeWidth="1" opacity="0.4" />
      <Crack />
    </g>
  ),
  metaphor: (
    <g>
      <rect x="4" y="10" width="22" height="20" rx="3" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.6" />
      <rect x="38" y="34" width="22" height="20" rx="3" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.4" />
      <line x1="26" y1="20" x2="38" y2="44" stroke="#5a8f6a" strokeWidth="1" opacity="0.3" strokeDasharray="3,3" />
      <Crack />
    </g>
  ),
  emotion: (
    <g>
      <polyline points="6,44 14,36 22,42 30,22 38,30 46,16 54,20" fill="none" stroke="#5a8f6a" strokeWidth="2" opacity="0.6" />
      <polyline points="10,48 18,40 26,46 34,26 42,34 50,20 56,24" fill="none" stroke="#5a8f6a" strokeWidth="1" opacity="0.3" strokeDasharray="2,3" />
      <Crack />
    </g>
  ),
  multimodal: (
    <g>
      <rect x="6" y="6" width="24" height="24" rx="3" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.7" />
      <circle cx="30" cy="42" r="10" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.5" />
      <line x1="22" y1="20" x2="24" y2="36" stroke="#5a8f6a" strokeWidth="1" opacity="0.3" />
      <Crack />
    </g>
  ),
  search: (
    <g>
      <circle cx="26" cy="28" r="16" fill="none" stroke="#5a8f6a" strokeWidth="1.8" opacity="0.7" />
      <circle cx="26" cy="28" r="6" fill="none" stroke="#5a8f6a" strokeWidth="1" opacity="0.4" />
      <line x1="38" y1="40" x2="54" y2="54" stroke="#5a8f6a" strokeWidth="2.5" opacity="0.5" />
      <line x1="18" y1="28" x2="34" y2="28" stroke="#5a8f6a" strokeWidth="1" opacity="0.3" />
      <Crack />
    </g>
  ),
  multilingual: (
    <g>
      <rect x="8" y="10" width="20" height="16" rx="2" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.7" />
      <rect x="36" y="22" width="18" height="14" rx="2" fill="none" stroke="#5a8f6a" strokeWidth="1.3" opacity="0.5" />
      <rect x="14" y="36" width="22" height="18" rx="2" fill="none" stroke="#5a8f6a" strokeWidth="1.2" opacity="0.4" />
      <Crack />
    </g>
  ),
  safety: (
    <g>
      {/* 裂开的盾形 */}
      <path d="M32,6 L54,16 L54,28 C54,44 32,58 32,58 C32,58 10,44 10,28 L10,16 Z" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.6" />
      <Crack />
    </g>
  ),
  politeness: (
    <g>
      <circle cx="32" cy="30" r="18" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.6" />
      <circle cx="26" cy="24" r="2" fill="#5a8f6a" opacity="0.5" />
      <circle cx="38" cy="24" r="2" fill="#5a8f6a" opacity="0.5" />
      <path d="M22,38 Q32,46 42,38" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.5" />
      <Crack />
    </g>
  ),
  honesty: (
    <g>
      {/* 断裂的天平 */}
      <line x1="32" y1="8" x2="32" y2="36" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.6" />
      <line x1="16" y1="36" x2="48" y2="36" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.6" />
      <path d="M10,36 L10,46 Q10,52 16,52" fill="none" stroke="#5a8f6a" strokeWidth="1.3" opacity="0.5" />
      <path d="M54,36 L54,46 Q54,52 48,52" fill="none" stroke="#5a8f6a" strokeWidth="1.3" opacity="0.5" />
      <Crack />
    </g>
  ),
  priority: (
    <g>
      <line x1="10" y1="10" x2="54" y2="10" stroke="#5a8f6a" strokeWidth="3" opacity="0.5" />
      <line x1="14" y1="24" x2="50" y2="24" stroke="#5a8f6a" strokeWidth="2.5" opacity="0.4" />
      <line x1="18" y1="36" x2="46" y2="36" stroke="#5a8f6a" strokeWidth="2" opacity="0.35" />
      <line x1="22" y1="46" x2="42" y2="46" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.3" />
      <line x1="26" y1="54" x2="38" y2="54" stroke="#5a8f6a" strokeWidth="1" opacity="0.25" />
      <Crack />
    </g>
  ),
  coherence: (
    <g>
      <line x1="8" y1="30" x2="22" y2="30" stroke="#5a8f6a" strokeWidth="3" opacity="0.7" />
      <line x1="24" y1="30" x2="32" y2="30" stroke="#5a8f6a" strokeWidth="3" opacity="0.5" />
      <line x1="34" y1="30" x2="38" y2="30" stroke="#5a8f6a" strokeWidth="3" opacity="0.3" />
      <line x1="40" y1="30" x2="42" y2="30" stroke="#5a8f6a" strokeWidth="3" opacity="0.15" />
      <line x1="8" y1="46" x2="56" y2="46" stroke="#5a8f6a" strokeWidth="1" opacity="0.2" strokeDasharray="4,4" />
      <Crack />
    </g>
  ),
  abstraction: (
    <g>
      <circle cx="20" cy="16" r="3" fill="#5a8f6a" opacity="0.6" />
      <circle cx="36" cy="22" r="3" fill="#5a8f6a" opacity="0.5" />
      <circle cx="16" cy="36" r="3" fill="#5a8f6a" opacity="0.4" />
      <circle cx="44" cy="38" r="3" fill="#5a8f6a" opacity="0.35" />
      <circle cx="28" cy="48" r="3" fill="#5a8f6a" opacity="0.3" />
      <circle cx="50" cy="16" r="2" fill="#5a8f6a" opacity="0.4" />
      <circle cx="10" cy="50" r="2" fill="#5a8f6a" opacity="0.3" />
      <circle cx="40" cy="52" r="2" fill="#5a8f6a" opacity="0.25" />
      <Crack />
    </g>
  ),
  context: (
    <g>
      {/* 断裂的链条 */}
      <circle cx="16" cy="28" r="8" fill="none" stroke="#5a8f6a" strokeWidth="1.8" opacity="0.7" />
      <circle cx="48" cy="28" r="8" fill="none" stroke="#5a8f6a" strokeWidth="1.8" opacity="0.5" />
      <circle cx="32" cy="48" r="8" fill="none" stroke="#5a8f6a" strokeWidth="1.8" opacity="0.3" />
      <line x1="24" y1="28" x2="40" y2="28" stroke="#5a8f6a" strokeWidth="1" opacity="0.3" strokeDasharray="3,3" />
      <Crack />
    </g>
  ),
  tone: (
    <g>
      <polyline points="6,44 14,36 22,42 30,32 38,38 46,26 54,28" fill="none" stroke="#5a8f6a" strokeWidth="2.5" opacity="0.6" />
      <polyline points="8,50 16,42 24,48 32,38 40,44 48,32 56,34" fill="none" stroke="#5a8f6a" strokeWidth="1" opacity="0.3" strokeDasharray="2,3" />
      <Crack />
    </g>
  ),
  logic: (
    <g>
      <rect x="8" y="14" width="16" height="10" rx="2" fill="none" stroke="#5a8f6a" strokeWidth="1.8" opacity="0.7" />
      <polygon points="30,10 30,28 44,19" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.5" />
      <rect x="28" y="36" width="14" height="14" rx="2" fill="none" stroke="#5a8f6a" strokeWidth="1.3" opacity="0.4" />
      <Crack />
    </g>
  ),
  precision: (
    <g>
      <rect x="6" y="10" width="52" height="44" rx="2" fill="none" stroke="#5a8f6a" strokeWidth="1.5" opacity="0.5" />
      <circle cx="28" cy="32" r="8" fill="none" stroke="#5a8f6a" strokeWidth="1.8" opacity="0.6" />
      <circle cx="28" cy="32" r="2" fill="#5a8f6a" opacity="0.5" />
      <line x1="36" y1="32" x2="48" y2="32" stroke="#5a8f6a" strokeWidth="1" opacity="0.4" />
      <line x1="28" y1="24" x2="28" y2="14" stroke="#5a8f6a" strokeWidth="1" opacity="0.4" />
      <line x1="46" y1="14" x2="46" y2="44" stroke="#5a8f6a" strokeWidth="0.5" opacity="0.15" />
      <Crack />
    </g>
  )
}

// 兜底图标
const defaultIcon = (
  <g>
    <rect x="6" y="6" width="52" height="52" rx="3" fill="none" stroke="#5a8f6a" strokeWidth="1.2" opacity="0.4" strokeDasharray="4,4" />
    <Crack />
  </g>
)

// 导出为 React 组件对象，每个返回完整 SVG
const capabilityIcons = {}
for (const [slug, content] of Object.entries(iconBase)) {
  capabilityIcons[slug] = (
    <svg viewBox="0 0 64 64" className="w-14 h-14 md:w-20 md:h-20">
      {content}
    </svg>
  )
}

// 兜底：unknown slug 动态生成
capabilityIcons._default = defaultIcon

// 支持函数调用获取图标（处理未知 slug）
export function getCapabilityIcon(slug) {
  return capabilityIcons[slug] || (
    <svg viewBox="0 0 64 64" className="w-14 h-14 md:w-20 md:h-20">
      {defaultIcon}
    </svg>
  )
}

// 兼容旧 API
export default capabilityIcons
