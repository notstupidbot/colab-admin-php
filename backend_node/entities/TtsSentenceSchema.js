
import {EntitySchema} from "typeorm"  
import TtsSentence from "../models/TtsSentence.js"      

const TtsSentenceSchema = new EntitySchema({
    name: "TtsSentence",
    target: TtsSentence,
    columns: {
        id : {
            type : "int", 
			primary : true, 
			generated : true, 

        },
		project_id : {
            type : "int", 

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
		content : {
            type : "text", 
			nullable : true, 

        },
		sentences : {
            type : "text", 
			nullable : true, 

        },
		content_ttf : {
            type : "text", 
			nullable : true, 

        },
		output_file : {
            type : "varchar", 
			nullable : true, 

        },
		user_id : {
            type : "int", 
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



export default TtsSentenceSchema
    