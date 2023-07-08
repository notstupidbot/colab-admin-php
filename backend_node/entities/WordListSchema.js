
import {EntitySchema} from "typeorm"  
import WordList from "../models/WordList.js"      

const WordListSchema = new EntitySchema({
    name: "WordList",
    target: WordList,
    columns: {
        id : {
            type : "int", 
			primary : true, 
			generated : true, 

        },
		content : {
            type : "varchar", 

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



export default WordListSchema
    