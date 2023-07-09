import util from 'util' 
import child_process from 'child_process'
import Preference from "../models/Preference.js"

const execPromise = util.promisify(child_process.exec)

async function runCommand(command = 'ls -l') {
 
    try {
        const { stdout, stderr } = await execPromise(command);
        return [stdout, stderr]
    } catch (error) {
        console.error('Error:', error)
        return [null, null, error]
    }
    return [null, null]
}
const getTtsPrefs = async(manager)=>{
    let ttsServerEndPoint, ttsServerProxy, ttsServerUseProxy

    const group = 'tts_server' 
    const prefs = await manager.find(Preference, {group})

    if(prefs){
        if(prefs.length){
            for(let i in prefs){
                const pref = prefs[i]
                try{
                    if(pref.key == 'tts_server.endpoint'){
                        ttsServerEndPoint = JSON.parse(pref.val).url
                    }
                    if(pref.key == 'tts_server.proxy'){
                        ttsServerProxy = JSON.parse(pref.val).url
                    }
                    if(pref.key == 'tts_server.enable_proxy'){
                        ttsServerUseProxy = JSON.parse(pref.val).value
                    }
                }catch(e){
                    console.error(e)
                }
            }
        }
    }

    return [ttsServerEndPoint, ttsServerProxy, ttsServerUseProxy]
}
const calculateOffset = (pageNumber, limit) => {
    const offset = (pageNumber - 1) * limit
    return offset

}

const calculateTotalPages = (recordCount, limit) => {
    return Math.ceil(recordCount / limit)
}

const toSqliteDateTime = (dt) =>{
    const sqliteDatetime = dt.toISOString().replace('T', ' ').replace('Z', '');
    return sqliteDatetime
}
export {calculateOffset, calculateTotalPages, toSqliteDateTime, runCommand, getTtsPrefs}