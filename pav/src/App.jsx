import { useState } from 'react'
import './App.css'
import Main from './foundation/Main.jsx'

function App() {

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw'}}>
      <Main />
    </div>
  )
}

export default App
