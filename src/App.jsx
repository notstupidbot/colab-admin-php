import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import SideBar from "./components/SideBar"
import MainContent from "./components/MainContent"
function App() {
  const [count, setCount] = useState(0)

  return (
<>
{/* Navigation Toggle */}
<button type="button" className="text-gray-500 hover:text-gray-600" data-hs-overlay="#docs-sidebar" aria-controls="docs-sidebar" aria-label="Toggle navigation">
  <span className="sr-only">Toggle Navigation</span>
  <svg className="w-5 h-5" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
  </svg>
</button>
{/* End Navigation Toggle */}

<SideBar/>
<MainContent/>
</>
  )
}

export default App
