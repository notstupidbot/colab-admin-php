
import {EntitySchema} from "typeorm"  
import TtsProject from "../models/TtsProject.js"      

const TtsProjectSchema = new EntitySchema({
    name: "TtsProject",
    target: TtsProject,
    columns: {
        id : {
            type : "int", 
			primary : true, 
			generated : true, 

        },
		order : {
            type : "int", 
			nullable : true, 

        },
		title : {
            type : "varchar", 
			nullable : true, 

        },
		slug : {
            type : "varchar", 
			nullable : true, 

        },
		items : {
            type : "text", 
			nullable : true, 

        },
		user_id : {
            type : "int", 

        },
		create_date : {
            type : "datetime", 
			nullable : true, 

        },
		last_updated : {
            type : "datetime", 
			nullable : true, 

        },
    } 
       
    
})



export default TtsProjectSchema
    