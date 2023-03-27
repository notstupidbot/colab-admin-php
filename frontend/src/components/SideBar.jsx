import {useState, useEffect} from "react"
import { Link, NavLink } from 'react-router-dom';

export default function SideBar({config, showSidebar}){

  const cls = "hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform fixed top-0 left-0 bottom-0 z-[60] w-64 bg-white border-r border-gray-200 pt-7 pb-10 overflow-y-auto scrollbar-y lg:block lg:translate-x-0 lg:right-auto lg:bottom-0 dark:scrollbar-y dark:bg-gray-800 dark:border-gray-700"
  const activeTabCls = "flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-slate-700 rounded-md dark:bg-gray-900 dark:text-white"
  const inactiveTabCls = "flex items-center gap-x-3.5 py-2 px-2.5  hover:bg-gray-100 text-sm text-slate-700 rounded-md hover:bg-gray-100 dark:bg-gray-900 dark:text-white"
  const [hideSidebar,setHideSidebar] = useState(false)
  const [runTwice,dontRunTwice] = useState(true)
  const toggle = ()=>{
    const status = !hideSidebar
    setHideSidebar(status)
    config.getUiConfig().setHiddenSidebarStatus(status)
       
  }
 
  useEffect(()=>{
    config.getUiConfig().applyHiddenSidebarStatus(setHideSidebar)
  },[])
  const linkCls = ({ isActive, isPending }) => isActive ? activeTabCls :  inactiveTabCls
  // const hideSidebar = !sidebarShown.current[0]
  // console.log(hideSidebar)
  return(<>
    
    <button onClick={evt=>toggle()} type="button" className="text-gray-500 hover:text-gray-600" aria-controls="docs-sidebar" aria-label="Toggle navigation">
      <span className="sr-only">Toggle Navigation</span>
      <svg className="w-5 h-5" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
      </svg>
    </button>

    <div id="docs-sidebar" className={cls + " " + (hideSidebar?"hidden":"")} style={hideSidebar?{display:'none'}:{}}>
      <div className="px-6">
        <a className="flex-none text-xl font-semibold dark:text-white" href="#home" aria-label="Brand">Colab Admin</a>
      </div>
      <nav className="hs-accordion-group p-6 w-full flex flex-col flex-wrap">
        <div style={{zIndex:15}} className="relative">
          <button className="dark:text-white absolute -right-4 my-32" onClick={toggle}><i className="bi bi-chevron-left"></i></button>
        </div>
        <ul className="space-y-1.5">
          <li>
            <NavLink className={linkCls} to="/dashboard">
              <i className="bi bi-speedometer2"></i> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink className={linkCls} to="/tts">
              <i className="bi bi-globe2"></i> TTS
            </NavLink>
          </li>
          <li>
            <NavLink className={linkCls} to="/preferences">
              <i className="bi bi-sliders2"></i> Preferences
            </NavLink>
          </li>
          <li>
            <NavLink className={linkCls} to="/book">
              <i className="bi bi-code"></i> Book
            </NavLink>
          </li>
          <li>
            <NavLink className={linkCls} to="/bootstrap-icons">
              <i className="bi bi-bootstrap"></i> Bootstrap Icons
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  </>)
}