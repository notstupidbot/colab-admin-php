
import {EntitySchema} from "typeorm"  
import WordListTtf from "../models/WordListTtf.js"      

const WordListTtfSchema = new EntitySchema({
    name: "WordListTtf",
    target: WordListTtf,
    columns: {
        id : {
            type : "int", 
			primary : true, 
			generated : true, 

        },
		content : {
            type : "varchar", 

        },
		word_id : {
            type : "int", 

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



export default WordListTtfSchema
    