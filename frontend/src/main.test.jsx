import React from 'react'
import ReactDOM from 'react-dom/client'
import TestMinimal from './TestMinimal.jsx'
import './index.css'

console.log('🧪 Test main.jsx loading...')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestMinimal />
  </React.StrictMode>,
)
