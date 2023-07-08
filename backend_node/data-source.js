import {DataSource} from 'typeorm'
import CategorySchema from "./entities/CategorySchema.js"
import PostSchema from "./entities/PostSchema.js"
import JobSchema from "./entities/JobSchema.js"

const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "./main.sqlite",
    synchronize: true,
    logging: true,
    entities: [CategorySchema, PostSchema, JobSchema],
    subscribers: [],
    migrations: [],
})
AppDataSource.initialize()
.then(() => {
  console.log("Berhasil inilize ")
})
.catch((error) => console.log(error))

export {AppDataSource}