
import {EntitySchema} from "typeorm"  
import User from "../models/User.js"      

const UserSchema = new EntitySchema({
    name: "User",
    target: User,
    columns: {
        id : {
            type : "int", 
			primary : true, 
			generated : true, 

        },
		username : {
            type : "varchar", 

        },
		email : {
            type : "varchar", 
			nullable : true, 

        },
		password : {
            type : "text", 

        },
		first_name : {
            type : "varchar", 

        },
		last_name : {
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



export default UserSchema
    