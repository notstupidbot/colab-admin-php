
import {EntitySchema} from "typeorm"  
import SocketSession from "../models/SocketSession.js"      

const SocketSessionSchema = new EntitySchema({
    name: "SocketSession",
    target: SocketSession,
    columns: {
        id : {
            type : "int", 
			primary : true, 
			generated : true, 

        },
		ip_addr : {
            type : "varchar", 
			nullable : true, 

        },
		uuid : {
            type : "varchar", 
			nullable : true, 

        },
		connected : {
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



export default SocketSessionSchema
    