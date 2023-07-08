
import {EntitySchema} from "typeorm"  
import Preference from "../models/Preference.js"      

const PreferenceSchema = new EntitySchema({
    name: "Preference",
    target: Preference,
    columns: {
        id : {
            type : "int", 
			primary : true, 
			generated : true, 

        },
		key : {
            type : "varchar", 
			nullable : true, 

        },
		val : {
            type : "text", 

        },
		type : {
            type : "varchar", 
			nullable : true, 

        },
		group : {
            type : "varchar", 
			nullable : true, 

        },
		editor : {
            type : "varchar", 
			nullable : true, 

        },
		prop : {
            type : "varchar", 
			nullable : true, 

        },
		desc : {
            type : "varchar", 
			nullable : true, 

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



export default PreferenceSchema
    