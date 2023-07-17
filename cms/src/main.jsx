import React from 'react'
import ReactDOM from 'react-dom/client'
import Cms from './cms/Cms'
import './cms/themes/preline/index.tailwind.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Cms />
  </React.StrictMode>,
)
