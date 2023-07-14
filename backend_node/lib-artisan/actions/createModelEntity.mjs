import fs from "fs"
import {writeFile, jsonParseFile} from "./lib.js"
import {getFlagArgs} from "../fn.mjs"

const createModelFile = async(config, table_name, target_dir)=>{
    const outputFilename = `${config.model}.js`
    const outputPath = `${target_dir}/${outputFilename}`

    // if(fs.existsSync(outputPath)){
    //     console.error(`${outputPath} already exists, please delete it first `)
    //     return
    // }

    const outputContentBuffer = `
class ${config.model} {
    constructor(${config.fields.join(', ')}){
        ${config.fields.map((f,index)=>`${index>0?"\t\t":""}this.${f} = ${f}`).join("\n")}
    }
}

export default ${config.model}
    `
    await writeFile(outputPath, outputContentBuffer, `create model ${config.model} on ${target_dir}`)
}

const createEntityFile = async (config, table_name, target_dir) => {
  



    

    const outputFilename = `${config.schema}.js`
    const outputPath = `${target_dir}/${outputFilename}`

    // if(fs.existsSync(outputPath)){
    //     console.error(`${outputPath} already exists, please delete it first `)
    //     return
    // }
    const columnDef = {}
    
    config.fields.map((f,index) => {
        columnDef[f] = {
            type : config.types[index]
        }

        if(config.pk == f){
            columnDef[f].primary = true
            columnDef[f].generated = true
        }
        if(config.lengths){
            if(config.lengths[index]){
                columnDef[f].length = config.lengths[index]
            }
        }
        if(config.nullable){
            if(config.nullable.includes(f)){
                columnDef[f].nullable = true
            }
        }
        if(config.generated){
            if(config.generated.includes(f)){
                columnDef[f].generated = true
            }
        }


    }) 
    let columnDefBuffer = ""
    let columnDefBufferKey = {}
    
    config.fields.map((f,index)=>{
        columnDefBufferKey[f] = ""
        let propIdx = 0
        for(let prop in columnDef[f]){
            let value = columnDef[f][prop]
            if(prop == 'length'){
                value = parseInt(value)
            }
            else if(value === false || value === true){

            }else{
                value = `"${value}"`
            }
            columnDefBufferKey[f] += `${propIdx>0?"\t\t\t":""}${prop} : ${value}, \n`
            propIdx += 1
        }
    })

    config.fields.map((f,index)=>{
        columnDefBuffer += `${index>0?"\n\t\t":""}${f} : {
            ${columnDefBufferKey[f]}
        },`
    })
    const outputContentBuffer = `
import {EntitySchema} from "typeorm"  
import ${config.model} from "../models/${config.model}.js"      

const ${config.schema} = new EntitySchema({
    name: "${config.model}",
    target: ${config.model},
    columns: {
        ${columnDefBuffer}
    } 
       
    
})



export default ${config.schema}
    `
    await writeFile(outputPath, outputContentBuffer, `create entity ${config.schema} on ${target_dir}`)
}
const createModelEntity = async(table_name, target_dir) => {
    let json_path = false
    let separateTargetDir = false
    let outEntityDir = target_dir
    let outModelDir = target_dir

    const [jsonPathArgPresent, jsonPathArg] = getFlagArgs('schema')

    if(jsonPathArgPresent){
        json_path = jsonPathArg
    }

    if(!json_path){
        console.error(`Could not load schema json file`)
        process.exit(1)
        
    }

    // console.log(json_path)

    if(target_dir == 'custom'){
        const [outModelDirArgPresent, outModelDirArg] = getFlagArgs('out-model-dir')
        const [outEntityDirArgPresent, outEntityDirArg] = getFlagArgs('out-entity-dir')

        if(outEntityDirArg && outModelDir){
            separateTargetDir = true
            outEntityDir = outEntityDirArg
            outModelDir = outModelDirArg
        }else{
            console.error(`For custom individual target dir please invoke command like this:`)
            console.error(`createModelEntity <table_name> custom --out-model-dir=<target_dir> --out-entity-dir=<target_dir> --schema=<path_to_json>`)
            process.exit(1)
            
        }
    }else{
        if(!target_dir){
            console.error('no target dir set')
            process.exit(1)
        }
    }


    let config = await jsonParseFile(json_path, table_name, 'table', 'schema')


    if(config){
        await createModelFile(config, table_name, outModelDir)
        await createEntityFile(config, table_name, outEntityDir)
    }
    
    
}
createModelEntity.HELP = `createModelEntity <table_name> <target_dir> [model_entities.json]`
export default createModelEntity