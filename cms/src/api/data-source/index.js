
import {DataSource} from 'typeorm'
import config from "./config.json"

import 'dotenv/config' 

async function getEntities(schemaDef){
    console.log(schemaDef)
    const entitySchemas = []
    for(let table in schemaDef){
        const item = schemaDef[table]
        const entityModulePath = `../entities/${item.schema}`
        const moduleImport = await import( entityModulePath)

        entitySchemas.push(moduleImport.default)
    }

    return entitySchemas
}

const {CMS_DB_ENGINE, CMS_DB_LOCATION} = process.env



class DS{
    datasource = null
    manager = null
    getDataSource(){
        return this.datasourse
    } 
    async initialize(){
        const entities = await getEntities(config.schema)
        // console.log(entities)
        return new Promise(async(resolve, reject)=>{
            if(CMS_DB_ENGINE == 'sqlite'){
                if(CMS_DB_LOCATION){
                    this.datasource = new DataSource({
                        type: "better-sqlite3",
                        database:CMS_DB_LOCATION,
                        synchronize: true,
                        logging: true,
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