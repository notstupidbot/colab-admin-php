import fs from 'fs'
const writeFile = async(outputPath, outputContentBuffer, info) =>{
    try {
        const fileDescriptor = fs.openSync(outputPath, 'w'); // Open the file in write mode
        fs.writeSync(fileDescriptor, outputContentBuffer); // Write the data to the file
        fs.closeSync(fileDescriptor); // Close the file
        console.log(`${info} success.`)
    } catch (error) {
        console.error(`${info} failed.`)
    }
}
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
    
    let jsonContent = "{schema:{}}" 
    let config = {schema : {}}
    try{
        jsonContent = await fs.readFileSync(json_path)
        jsonContent = jsonContent.toString()
        config = JSON.parse(jsonContent)
    }catch(e){
        console.error(e)
    }

    if(!config.schema[table_name]){
        console.error(`No definition for table "${table_name}" specified in ${json_path}`)
        return
    }

    config = config.schema[table_name]
    await createModelFile(config, table_name, target_dir)
    await createEntityFile(config, table_name, target_dir)
    
}
createModelEntity.HELP = `createModelEntity <table_name> <target_dir> [model_entities.json]`
export default createModelEntity