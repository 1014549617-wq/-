import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Entrance from './pages/Entrance'
import Monitor from './pages/Monitor'
import Confessional from './pages/Confessional'

function App() {
  useEffect(() => {
    const handleClick = (e) => {
      // 在点击位置创建一个波纹元素
      const ripple = document.createElement('div')
      ripple.className = 'click-ripple'
      const size = Math.max(window.innerWidth, window.innerHeight) * 0.6
      ripple.style.width = size + 'px'
      ripple.style.height = size + 'px'
      ripple.style.left = e.clientX + 'px'
      ripple.style.top = e.clientY + 'px'
      document.body.appendChild(ripple)
      // 动画结束后移除
      ripple.addEventListener('animationend', () => {
        ripple.remove()
      })
    }
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Entrance />} />
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/confessional" element={<Confessional />} />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
