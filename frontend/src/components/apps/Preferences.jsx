
import React ,{useEffect,useState,useRef}from "react"
import { Outlet , NavLink } from 'react-router-dom';
export default function Preferences({}){
    const activeTabCls   = "tab-nav active hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 ";
    const inactiveTabCls = "tab-nav hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600";

    const 	hideSidebar = false
    const activeCls = ({ isActive, isPending }) => isActive ? activeTabCls :  inactiveTabCls
    return(<>
        <main>
            <nav className="relative z-0 flex border rounded-xl overflow-hidden dark:border-gray-700">
                <NavLink to="/preferences/tts-server" className={activeCls}>TTS Server</NavLink>
            </nav>

            <div className="mt-3">
                <Outlet/>
            </div>	
        </main>
    </>)
}