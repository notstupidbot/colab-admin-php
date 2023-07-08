import createReactComponent from './actions/createReactComponent.mjs'
import createModelEntity from "./actions/createModelEntity.js"
const availableActions = ['createReactComponent', 'createModelEntity']
const argv = process.argv
const showHelp = f => {
    console.log('Welcome to artisan')
    console.log(createReactComponent.HELP)
    console.log(createModelEntity.HELP)
}

const parseCmd = () => {

    return argv.length >= 3 ? argv[2] : null 
}

const processCmd = async (cmd) => {
    if(!availableActions.includes(cmd)){
        console.error(`${cmd} is not valid action`)
        process.exit(1)
    }
    if(cmd === 'createReactComponent'){
        argv.splice(0,3)
        const [name, target_dir] = argv
        if(name && target_dir){
            await createReactComponent(name, target_dir)
        }else{
            console.log(createReactComponent.HELP)

        }
    }
    if(cmd === 'createModelEntity'){
        argv.splice(0,3)
        let json_path = null
        const [table_name, target_dir, json_path_arg] = argv
        json_path = json_path_arg
        if(!json_path){
            json_path = "./model_entities.json"
        }
        if(table_name && target_dir){
            await createModelEntity(table_name, target_dir, json_path)
        }else{
            console.log(createModelEntity.HELP)

        }
    }
}

const main = async () => {
    const cmd = parseCmd()

    if(cmd){
        await processCmd(cmd)
    }else{
        showHelp()
    }

    process.exit(0)
}

main()