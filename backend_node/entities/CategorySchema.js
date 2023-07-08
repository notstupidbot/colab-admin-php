import {EntitySchema} from "typeorm"  
import Post from "../models/Post.js"  
import Category from "../models/Category.js"
const CategorySchema = new EntitySchema({
    name: "Category",
    target: Category,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar"
        }
    }
})

export default CategorySchema