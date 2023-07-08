
import {EntitySchema} from "typeorm"  
import Messaging from "../models/Messaging.js"      

const MessagingSchema = new EntitySchema({
    name: "Messaging",
    target: Messaging,
    columns: {
        id : {
            type : "int", 
			primary : true, 
			generated : true, 

        },
		subscriber_id : {
            type : "varchar", 

        },
		ip_addr : {
            type : "varchar", 

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



export default MessagingSchema
    