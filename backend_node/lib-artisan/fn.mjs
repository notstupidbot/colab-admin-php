const importActionModules = async (availables) => {
    const actionModules = {}
    for(const actionName of Object.keys(availables)){
        // console.log(action)
        const moduleImport = await import(`./actions/${actionName}.mjs`)
        actionModules[actionName] = moduleImport.default
        // console.log(actions[action])
    }

    return actionModules
}

const showHelp = (availables, moduleActions) => {
    console.log('Welcome to artisan')
    Object.keys(availables).map(actionName => console.log(moduleActions[actionName].HELP))
}

const getActionArgs = (argv) => {
    return argv.length >= 3 ? argv[2] : null 
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
                console.error(actionModules[actionName].HELP)
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
export {importActionModules, showHelp, getActionArgs, processAction}