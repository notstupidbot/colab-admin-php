import React from "react";
import Helper from "../../../../../lib/Helper"

const delay = Helper.makeDelay(250)
/**
 * TaskQueueToolbar
 * 
 * state = {
        itemCount: 0,
        taskModeExtract : false,
        taskModeConvert : false,
        taskModeSynthesize : false,
        taskConvertConfig : {run : false, index : -1, next : -1, result : -1},
        taskSynthesizeConfig : {run : false, index : -1, next : -1, result : -1},
        taskExtractConfig : {run : false, index : -1, next : -1, result : -1},
    }
 * @component
 * @example
 * <TaskQueueToolbar onExtractTask={} onConvertTask={} onSynthesizeTask={}>
 * */
class TaskQueueToolbar extends React.Component{
    // parent = null
    constructor(props){
        super(props)
        // this.parent = props.parent
        this.state = {
            itemCount: 0,
            taskModeExtract : false,
            taskModeConvert : false,
            taskModeSynthesize : false,
            taskConvertConfig : {run : false, index : -1, next : -1, result : -1},
            taskSynthesizeConfig : {run : false, index : -1, next : -1, result : -1},
            taskExtractConfig : {run : false, index : -1, next : -1, result : -1},
        }
    }

    /**
     * applyState
     * @example 
     * tqt.applyState({taskModeExtract,taskModeConvert,taskModeSynthesize ,
            taskConvertConfig,taskSynthesizeConfig, taskExtractConfig ,itemCount})
     * */
    applyState(srcState){
        const {
            taskModeExtract,taskModeConvert,taskModeSynthesize ,
            taskConvertConfig,taskSynthesizeConfig, taskExtractConfig ,itemCount
        } = srcState

        const appliedState = {
            taskModeExtract,taskModeConvert,taskModeSynthesize ,
            taskConvertConfig,taskSynthesizeConfig, taskExtractConfig ,itemCount
        }
        this.setState(appliedState)
        // console.log(appliedState)
    }
    
    
    render(){
        const btnCls = "py-1 px-1 mx-2 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
		const loadingCls = "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
        
        const {taskModeSynthesize, taskModeExtract, taskModeConvert, itemCount,
            taskSynthesizeConfig, taskExtractConfig, taskConvertConfig} = this.state

        return(<div id="sei-task-queue-toolbar" className="absolute z-10 right-[2px]">
            <div className="inline-flex shadow-sm">
                <button disabled={taskModeExtract} title="Extract Lines" type="button" onClick={ evt => this.props.onExtractTask(evt) } 
                        className={btnCls}>
                    
                    {
                        taskModeExtract ? (<span className={loadingCls} role="status" aria-label="loading">
                        <span className="sr-only">Loading...</span>
                    </span>) : (<i className="bi bi-list-check"></i>)
                    }
                </button>
                {
                    itemCount ? (
                        <button disabled={taskModeConvert} title="Convert All" type="button" onClick={ evt => this.props.onConvertTask(evt) } className={btnCls}>
                        {
                            taskModeConvert ? (<span className={loadingCls} role="status" aria-label="loading">
                                                                    <span className="sr-only">Loading...</span>
                                                                </span>) : (<i className="bi bi-translate"></i>)
                        }
                        </button>
                    ) : ""
                }
                {
                    itemCount ? (
                        <button disabled={taskModeSynthesize} title="Synthesize All" type="button" onClick={ evt => this.props.onSynthesizeTask(evt) } className={btnCls}>
                        {
                            taskModeSynthesize ? (<span className={loadingCls} role="status" aria-label="loading">
                                                                    <span className="sr-only">Loading...</span>
                                                                </span>) : (<i className="bi bi-soundwave"></i>)
                        }
                        </button>
                    ) : ""
                }
            </div>
        </div>)
    }
}


export default TaskQueueToolbar