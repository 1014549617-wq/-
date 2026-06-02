import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Entrance from './pages/Entrance'
import Monitor from './pages/Monitor'
import Confessional from './pages/Confessional'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Entrance />} />
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/confessional" element={<Confessional />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
