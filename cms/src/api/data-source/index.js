
import {DataSource} from 'typeorm'
import config from "./config.json" assert { type: "json" }

import 'dotenv/config' 

async function getEntities(schemaDef){
    // console.log(schemaDef)
    const entitySchemas = []
    const models = {}
    for(let table in schemaDef){
        const item = schemaDef[table]
        const entityModulePath = `../entities/${item.schema}.js`
        const modelModulePath = `../models/${item.model}.js`
        
        try{
            const moduleImport = await import(/* @vite-ignore */  entityModulePath)

            entitySchemas.push(moduleImport.default)
        }catch(e){
            console.error(e)
        }

        try{
            const modelImport = await import(/* @vite-ignore */  modelModulePath)

            models[item.model]= modelImport.default
            models[`M${item.model}`]=modelImport[`M${item.model}`]
        }catch(e){
            console.error(e)
        }
        
    }

    return [entitySchemas, models]
}

const {CMS_DB_ENGINE, CMS_DB_LOCATION} = process.env



class DS{
    datasource = null
    manager = null
    models = {}
    getDataSource(){
        return this.datasourse
    } 
    getModel(modelName){
        return this.models[modelName]
    }
    factory(modelName,m=false){
        let instance 
        if(m){
            instance = new this.models[modelName](this.datasource)
        }else{
            instance = new this.models(modelName)
        }
        return instance
    }
    async initialize(){
        const [entities, models] = await getEntities(config.schema)
        // console.log(models)
        this.models = models
        // console.log(entities)
        return new Promise(async(resolve, reject)=>{
            if(CMS_DB_ENGINE == 'sqlite'){
                if(CMS_DB_LOCATION){
                    this.datasource = new DataSource({
                        type: "better-sqlite3",
                        database:CMS_DB_LOCATION,
                        synchronize: true,
                        logging: 0,
                        entities,
                        subscribers: [],
                        migrations: [],
                    })
                    this.manager = this.datasource.manager
                    this.datasource.initialize().then(resolve(true)).catch(e=>{
                        console.error(e)
                        reject(e)
                    })
                }else{
                    reject(false)
                    console.log('Data Source is not loaded')
                }
            }
        })
        
    }
}


 

const datasource = new DS()
export {datasource}