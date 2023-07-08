import fs from "fs"
import {writeFile, camelToDashCase, excludeFields} from "./lib.js"

  
const createRouteFile = async(config, table_name, target_dir)=>{
    const ctl = camelToDashCase(config.model)

    const outputFilename = `${ctl}.js`
    const outputPath = `${target_dir}/${outputFilename}`

    // if(fs.existsSync(outputPath)){
    //     console.error(`${outputPath} already exists, please delete it first `)
    //     return
    // }
    const modelInstanceName = config.model.toLowerCase()
    let modelInstanceAssignmentBuffer = ""
    let requiredFields = excludeFields([config.pk], config.fields)

    if(config.nullable){
        requiredFields = excludeFields(config.nullable, requiredFields)
    }
    if(config.generated){
        requiredFields = excludeFields(config.generated, requiredFields)
    }
    requiredFields.map((f,index)=>{
        modelInstanceAssignmentBuffer += `${ index > 0 ? "\t\t" : "" }${modelInstanceName}.${f} = ${f}\n`
    })

    const outputContentBuffer = `
import express from "express"


// Retrieve all users
const router = express.Router()
import {
    AppDataSource
} from '../data-source.js'

import ${config.model} from "../models/${config.model}.js"

router.get('/${ctl}s', async (req, res) => {
    // Route logic for handling GET '/${ctl}'

    try {
        const ${modelInstanceName}s =  await AppDataSource.manager.find(${config.model})
        const list = ${modelInstanceName}s
        res.json({list})
    }catch(e){
        console.error(e)
        res.json(e)

    }
});

router.get('/${ctl}/:id',async (req, res) => {
    // Route logic for handling GET '/${ctl}/:id'
    let ${config.pk} = req.params.${config.pk}
    
    try{
      const ${modelInstanceName} = await AppDataSource.manager.findOne(${config.model}, {where:{${config.pk}}})

      res.send({data : ${modelInstanceName}})
    }catch(e){
      console.error(e)
    }
});

router.post('/${ctl}/create',async (req, res) => {
    // Route logic for handling POST '/${ctl}/create'
    let {${requiredFields.join(', ')}} = req.body
    const ${modelInstanceName} = new ${config.model}()
    ${modelInstanceAssignmentBuffer}
    let success = false
    let data =  ${modelInstanceName}
    let message = ""

    try{
        success = true
        message = "Created"

        data = await AppDataSource.manager.save(data)
    }catch(err){
        console.log(err)
        message = "Create failed"

    }
    res.send({success, data, message})

});

router.post('/${ctl}/update/:${config.pk}?',async (req, res) => {
    // Route logic for handling POST '/${ctl}/update'
    let ${config.pk} 
    if(request.body.${config.pk}){
        ${config.pk} = request.body.${config.pk}
    }
    if(!${config.pk}){
        ${config.pk} = req.params.${config.pk}
    }
    
    const {${requiredFields.join(', ')}} = req.body
    const updatedData = {${requiredFields.join(', ')}}
    let success = false
    let data = updatedData
    let message = ""
    try{
      const ${modelInstanceName} = await AppDataSource.manager.findOne(${config.model}, {where:{${config.pk}}})
      if(${modelInstanceName}){
        AppDataSource.manager.merge(${config.model}, ${modelInstanceName}, updatedData)
        const updated_${modelInstanceName} = await AppDataSource.manager.save(${modelInstanceName} )
        success = true
        message = "Updated"
        data = updated_${modelInstanceName}
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})

});

router.post('/${ctl}/delete/:id?',async (req, res) => {
    // Route logic for handling POST '/${ctl}/delete'
    let ${config.pk} 
    if(request.body.${config.pk}){
        ${config.pk} = request.body.${config.pk}
    }
    if(!${config.pk}){
        ${config.pk} = req.params.${config.pk}
    }
    
    console.log(${config.pk})
    
    let success = false
    let data = null
    let message = ""
    try{
      const ${modelInstanceName} = await AppDataSource.manager.findOne(${config.model}, {where:{${config.pk}}})
      if(${modelInstanceName}){
        const deleted_${modelInstanceName} = await AppDataSource.manager.remove(${modelInstanceName})
        success = true
        message = "Deleted"
        data = deleted_${modelInstanceName}
      }else{
        message = "no record"
      }
      
    }catch(e){
      console.error(e)
    }
    res.send({success, data, message})
});
export {router}
    `
    await writeFile(outputPath, outputContentBuffer, `create route ${config.model} on ${target_dir}`)
}

const createModelAPIRoute = async(table_name, target_dir, json_path) => {
    
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
    await createRouteFile(config, table_name, target_dir)
    
}
createModelAPIRoute.HELP = `createModelAPIRoute <table_name> <target_dir> [model_entities.json]`
export default createModelAPIRoute