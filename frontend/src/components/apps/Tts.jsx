import { Outlet , NavLink } from 'react-router-dom';
export default function Tts({config}){
	
	const activeTabCls = "hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-white first:border-l-0 border-l border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-400 active";
	const inactiveTabCls = "hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-white first:border-l-0 border-l border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-400 dark:hover:text-gray-300";


	

  const activeCls = ({ isActive, isPending }) => isActive ? activeTabCls :  inactiveTabCls
  return(<>
	  <main>
		  <nav className="relative z-0 flex border rounded-xl overflow-hidden dark:border-gray-700">
		    <NavLink to="/tts/project" id="project-tab"
		    			className={activeCls}>
		      TTS Project
		    </NavLink>
		    <NavLink to="/tts/project-editor" id="project-editor-tab" className={activeCls}>
		      Project Editor
		    </NavLink>
		   {/* <NavLink to="/tts/sentence" className={activeCls}>
		      TTS Sentences
		    </NavLink>*/}
		    
		    <NavLink to="/tts/sentence-editor" id="sentence-editor-tab"
		    		  className={activeCls} >
		      Sentence Editor
		    </NavLink>
		   
		  </nav>

		  <div className="mt-3">
		    <Outlet/>
		  </div>	
	  </main>
  </>)
}