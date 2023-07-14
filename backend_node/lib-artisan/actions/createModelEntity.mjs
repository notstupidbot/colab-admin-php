import fs from "fs"
import {writeFile, jsonParseFile} from "./lib.js"

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
            if(value === false || value === true){

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
const createModelEntity = async(table_name, target_dir, json_path) => {
    

    let config = await jsonParseFile(json_path, table_name, 'table', 'schema')
    if(config){
        await createModelFile(config, table_name, target_dir)
        await createEntityFile(config, table_name, target_dir)
    }
    
    
}
createModelEntity.HELP = `createModelEntity <table_name> <target_dir> [model_entities.json]`
export default createModelEntity