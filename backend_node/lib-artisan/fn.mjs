import fs from "fs"
const importActionModules = async (availables) => {
    const actionModules = {}
    for(const actionName of Object.keys(availables)){
        // console.log(action)
        const modulePath = `./actions/${actionName}.mjs`
        // const moduleExists = await fs.existsSync(modulePath)
        // console.log(moduleExists)

        // if(!moduleExists){
        //     console.error(`WARN: ${modulePath} NOT EXISTS`)
        //     continue
        // }
        try{
            const moduleImport = await import(modulePath)
            // console.log(moduleImport)
            actionModules[actionName] = moduleImport.default
        }catch(e){
            console.error(e)
            // console.error(`${modulePath} ${e.code}`)
        }
        
        // console.log(actions[action])
    }

    return actionModules
}
const getFlagArgs = flag =>{
    const {argv} = process
    for(let i in argv){
        const arg = argv[i]
        const regex = new RegExp(`--${flag}`)
        if(arg.match(regex)){
            const argSplit = arg.split('=')
            const [flag, value] = argSplit
            return [true,value]
            break
        }
        // console.log(arg)
    }
    return [false, null]
}
const showHelp = (availables, moduleActions) => {
    console.log('Welcome to artisan')

    const helps = Object.keys(availables).filter(item=>!item.match(/_\d+$/)).map(actionName => {
     
        let usageCmd = `${actionName} `
        const availableArguments = availables[actionName].arguments 
        for(let avaArgItem in availableArguments){
            const {required} = availableArguments[avaArgItem]
            usageCmd += required ? ` <${avaArgItem}>`:` [${avaArgItem}]`
        }

        return  usageCmd 
    })

    console.log(helps.join("\n"))
}

const getActionArgs = (argv) => {
    return argv.length >= 3 ? argv[2] : null 
}

const createHelpByAvaArgs = ( actionName, availableArguments) => {
    let usageIntro = "Usage :"
    let usageCmd = `${actionName} `
    let usageBuffer = ""
    for(let avaArgItem in availableArguments){
        const {defaultValue, required, desc} = availableArguments[avaArgItem]
        usageCmd += required ? ` <${avaArgItem}>`:` [${avaArgItem}]`
        const displayDefault = !required? `(default ${defaultValue})`:''
        usageBuffer += `\t${avaArgItem} \t ${desc} ${displayDefault}\n`
    }

    return `
${usageIntro}
    ${usageCmd}
${usageBuffer}
`

}
const processAction = async (actionName, argv, actionModules, availables) => {
    argv.splice(0,3)

    if(!Object.keys(availables).includes(actionName)){
        console.error(`${actionName} is not valid action`)
        process.exit(1)
    }

    const inputArguments = []
    const availableArguments = availables[actionName].arguments
    let argIndex = 0
    for(let avaArgItem in availableArguments){
        const {defaultValue, required} = availableArguments[avaArgItem]
        // console.log(avaArgItem)
        
        // check arg is required and set from argv
        
        if(!argv[argIndex]){
            if(required){
                //console.error(actionModules[actionName].HELP)
                const help = createHelpByAvaArgs(actionName, availableArguments)
                console.error(help)
                process.exit(1)
            }
        }else{
            inputArguments[argIndex] = argv[argIndex]
        }

        // check if input arguments set or set to default 
        if(!required){
            if(!inputArguments[argIndex]){
                inputArguments[argIndex] = defaultValue
            }
        }

        argIndex += 1
    }
    // console.log(availableArguments)
    // console.log(inputArguments)
    await actionModules[actionName].apply(null, inputArguments)
}

// const processCmd_old = async (cmd) => {
//     if(!availableActions.includes(cmd)){
//         console.error(`${cmd} is not valid action`)
//         process.exit(1)
//     }
//     if(cmd === 'createReactComponent'){
//         argv.splice(0,3)
//         const [name, target_dir] = argv
//         if(name && target_dir){
//             await createReactComponent(name, target_dir)
//         }else{
//             console.log(createReactComponent.HELP)

//         }
//     }
//     if(cmd === 'createModelEntity'){
//         argv.splice(0,3)
//         let json_path = null
//         const [table_name, target_dir, json_path_arg] = argv
//         json_path = json_path_arg
//         if(!json_path){
//             json_path = "./model_entities.json"
//         }
//         if(table_name && target_dir){
//             await createModelEntity(table_name, target_dir, json_path)
//         }else{
//             console.log(createModelEntity.HELP)

//         }
//     }
//     if(cmd === 'createModelAPIRoute'){
//         argv.splice(0,3)
//         let json_path = null
//         const [table_name, target_dir, json_path_arg] = argv
//         json_path = json_path_arg
//         if(!json_path){
//             json_path = "./model_entities.json"
//         }
//         if(table_name && target_dir){
//             await createModelAPIRoute(table_name, target_dir, json_path)
//         }else{
//             console.log(createModelAPIRoute.HELP)

//         }
//     }
//     if(cmd === 'listModelAPIRoutes'){
//         argv.splice(0,3)
//         let json_path = null
//         const [json_path_arg] = argv
//         json_path = json_path_arg
//         if(!json_path){
//             json_path = "./model_entities.json"
//         }
//         await listModelAPIRoutes(json_path)
        
//     }
// }
export {importActionModules, showHelp, getActionArgs, processAction, getFlagArgs}