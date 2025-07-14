import { useState } from 'react'
import './App.css'
import Main from './foundation/Main.jsx'
import Dead from './foundation/Dead.jsx'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/alive" element={
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw'}}>
            <Main />
          </div>} 
        />
        <Route path="/" element={
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw'}}>
            <Dead />
          </div>} 
        />
      </Routes>
    </Router>
  )
}

export default App
