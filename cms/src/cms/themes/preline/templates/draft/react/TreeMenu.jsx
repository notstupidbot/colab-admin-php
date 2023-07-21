
 const TreeMenu = ({})=>{
    const styles = {  }
    const cls0 = "cls-0 px-2 hover:bg-secondary-100"
		const cls1 = "cls-1 flex items-center px-2 hover:bg-secondary-100 focus:text-primary active:text-primary"
		const cls2 = "cls-2 h-4 w-4"
		const cls3 = "cls-3 !visible hidden"
		const cls4 = "cls-4 ml-4 px-2 hover:bg-secondary-100"
		const cls5 = "cls-5 ml-4"
		const cls6 = "cls-6 ml-4 px-2"

    return <>
    <ul> 
     <li className={cls0}> One </li> 
     <li className={cls0}> Two </li> 
     <li> 
       <a data-te-collapse-init="" href="javascript:;" role="button" aria-expanded="false" aria-controls="collapseThree" className={cls1}> 
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={cls2}> 
           <path strokeLinecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"> </path> 
         </svg> 
        Three
       </a> 
       <ul id="collapseThree" data-te-collapse-item="" className={cls3}> 
         <li className={cls4}> Second-one </li> 
         <li className={cls4}> Second-two </li> 
         <li className={cls5}> 
           <a data-te-collapse-init="" href="#collapseSecondThree" role="button" aria-expanded="false" aria-controls="collapseSecondThree" className={cls1}> 
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={cls2}> 
               <path strokeLinecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"> </path> 
             </svg> 
            Second-three
           </a> 
           <ul id="collapseSecondThree" data-te-collapse-item="" className={cls3}> 
             <li className={cls6}> 
               <a data-te-collapse-init="" href="#collapseThirdOne" role="button" aria-expanded="false" aria-controls="collapseThirdOne" className={cls1}> 
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={cls2}> 
                   <path strokeLinecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"> </path> </svg> Third-one
               </a> 
               <ul id="collapseThirdOne" data-te-collapse-item="" className={cls3}> 
                 <li className={cls4}> 
                  Fourth-one
                 </li> 
                 <li className={cls4}> 
                  Fourth-two
                 </li> 
                 <li className={cls4}> 
                  Fourth-three
                 </li> 
               </ul> 
             </li> 
             <li className={cls4}> Third-two </li> 
             <li className={cls5}> 
               <a data-te-collapse-init="" href="#collapseThirdThree" role="button" aria-expanded="false" aria-controls="collapseThirdThree" className={cls1}> 
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className={cls2}> 
                   <path strokeLinecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"> </path> </svg> Third-three
               </a> 
               <ul id="collapseThirdThree" data-te-collapse-item="" className={cls3}> 
                 <li className={cls4}> 
                  Fourth-one
                 </li> 
                 <li className={cls4}> 
                  Fourth-two
                 </li> 
                 <li className={cls4}> 
                  Fourth-three
                 </li> 
               </ul> 
             </li> 
           </ul> 
         </li> 
       </ul> 
     </li> 
   </ul>
    </>
 }   

 export default  TreeMenu
    