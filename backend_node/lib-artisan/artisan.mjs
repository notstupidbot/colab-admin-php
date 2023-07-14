// import createReactComponent from './actions/createReactComponent.mjs'
// import createModelEntity from "./actions/createModelEntity.mjs"
// import createModelAPIRoute from "./actions/createModelAPIRoute.mjs"
// import listModelAPIRoutes from "./actions/listModelAPIRoutes.mjs"

import config from "./actions.json" assert { type: "json" }
import {importActionModules, showHelp, getActionArgs, processAction} from "./fn.mjs"

const main = async () => {
    const {argv} = process
    const {availables} = config
    
    const moduleActions = await importActionModules(availables)
    const actionName = getActionArgs(argv)

    if(actionName){
        await processAction(actionName, argv, moduleActions, availables)
    }else{
        showHelp(availables, moduleActions)
    }

    // process.exit(0)
}

main()