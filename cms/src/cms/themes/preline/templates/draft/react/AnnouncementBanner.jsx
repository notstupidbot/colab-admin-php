
 const AnnouncementBanner = ({})=>{
    const cls0 = "cls-0 bg-white/[.6] backdrop-blur-lg dark:bg-slate-900/[.6]"
		const cls1 = "cls-1 max-w-[85rem] px-4 py-4 sm:px-6 lg:px-8 mx-auto"
		const cls2 = "cls-2 grid justify-center sm:grid-cols-2 sm:items-center gap-4"
		const cls3 = "cls-3 flex items-center gap-x-3 md:gap-x-5"
		const cls4 = "cls-4 flex-shrink-0 w-10 h-10 md:w-14 md:h-14"
		const cls5 = "cls-5 fill-blue-600"
		const cls6 = "cls-6 grow"
		const cls7 = "cls-7 md:text-xl text-gray-800 font-semibold dark:text-gray-200"
		const cls8 = "cls-8 text-sm md:text-base text-gray-800 dark:text-gray-200"
		const cls9 = "cls-9 text-center sm:text-left flex sm:justify-end sm:items-center gap-x-3 md:gap-x-4"
		const cls10 = "cls-10 py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md sm:rounded-full border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm md:py-3 md:px-4"
		const cls11 = "cls-11 py-[.4125rem] px-3 inline-flex justify-center items-center gap-2 rounded-md sm:rounded-full border-2 border-gray-900 font-semibold text-gray-800 hover:text-white hover:bg-gray-800 hover:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm md:py-[.688rem] md:px-4 dark:hover:bg-white dark:border-gray-200 dark:hover:border-white dark:text-white dark:hover:text-gray-800 dark:focus:ring-white dark:focus:ring-offset-gray-800"

    return <>
    {/* Announcement Banner */} 
 <div className={cls0}> 
     <div className={cls1}> 
       {/* Grid */} 
       <div className={cls2}> 
         <div className={cls3}> 
           <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls4}> 
             <rect width="40" height="40" rx="6" fill="currentColor" className={cls5}> </rect> 
             <path d="M8 32.5V19.5C8 12.8726 13.3726 7.5 20 7.5C26.6274 7.5 32 12.8726 32 19.5C32 26.1274 26.6274 31.5 20 31.5H19" stroke="white" strokeWidth="2"> </path> 
             <path d="M12 32.5V19.66C12 15.1534 15.5817 11.5 20 11.5C24.4183 11.5 28 15.1534 28 19.66C28 24.1666 24.4183 27.82 20 27.82H19" stroke="white" strokeWidth="2"> </path> 
             <circle cx="20" cy="19.5214" r="5" fill="white"> </circle> 
           </svg> 
  
           <div className={cls6}> 
             <p className={cls7}> 
              Get started today.
             </p> 
             <p className={cls8}> 
              Sign up to get unlimited updates.
             </p> 
           </div> 
         </div> 
         {/* End Col */} 
  
         <div className={cls9}> 
           <a href="#" className={cls10}> 
            Free trial
           </a> 
           <a href="#" className={cls11}> 
            Buy now
           </a> 
         </div> 
         {/* End Col */} 
       </div> 
       {/* End Grid */} 
     </div> 
   </div> 
   {/* End Announcement Banner */}
    </>
 }   

 export default  AnnouncementBanner
    