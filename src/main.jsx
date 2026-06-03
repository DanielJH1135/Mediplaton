import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 만약 프로젝트에 전역 css 파일이 있다면 여기에 import 하시면 됩니다.
// 예: import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)