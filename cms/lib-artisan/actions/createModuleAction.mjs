import {jsonParseFile, writeFile, confirm, renameFile} from "./lib.js"
import fs from "fs"
import path from "path"
const createModuleAction = async(actionName, argListStr, jsonPath)=>{
    // console.log(actionName)
    const dt = new Date
    const config = await jsonParseFile(jsonPath)
    const configBackupKey = `${actionName}_${dt.getTime()}`
    const actionFilename = `${actionName}.mjs`
    const actionBackupFilename = `${configBackupKey}.mjs`

    const targetDir  = path.dirname(jsonPath)
    const outputFile = `${targetDir}/actions/${actionFilename}` 
    const outputFileBackup = `${targetDir}/actions/${actionBackupFilename}` 

    // console.log(config)

    if(config.availables[actionName]){
        config.availables[configBackupKey] = Object.assign({}, config.availables[actionName])
    }
    const argListSplit = argListStr.split(',')
    console.log(argListSplit)

    let actionBuffer = `
const ${actionName} = async (${argListSplit.join(', ')}) => {
    console.log(\`${actionName}\`)
}

export default ${actionName}
    `

    let actionConf = {arguments:{}}
    argListSplit.map(arg => {
        actionConf.arguments[arg] = {
            type : "string",
            required : true,
            desc : ""
        }
    })
    config.availables[actionName] = actionConf
    let fileExist = await fs.existsSync(outputFile)
    if(fileExist){
        await renameFile(outputFile, outputFileBackup)
    }
    fileExist = await fs.existsSync(outputFile)
    let writeFileState = true
    if(fileExist){
        const answer = await confirm(`Overwrite ${outputFile} ? [y/n]`)
        writeFileState = answer === 'y' || answer === 'yes'
    }

    if(writeFileState){
        await writeFile(outputFile, actionBuffer, `${actionFilename}`)

    }

    const jsonBuffer = JSON.stringify(config, null, 2)
    await writeFile(jsonPath, jsonBuffer, `actions.json`)

    // console.log(actionBuffer)
    // console.log(config)
}

export default createModuleAction