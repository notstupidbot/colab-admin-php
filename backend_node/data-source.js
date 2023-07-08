import {DataSource} from 'typeorm'
import CategorySchema from "./entities/CategorySchema.js"
import PostSchema from "./entities/PostSchema.js"
import JobSchema from "./entities/JobSchema.js"
import MessagingSchema from "./entities/MessagingSchema.js"
import PreferenceSchema from "./entities/PreferenceSchema.js"
import SocketSessionSchema from "./entities/SocketSessionSchema.js"
import TtsProjectSchema from "./entities/TtsProjectSchema.js"
import TtsSentenceSchema from "./entities/TtsSentenceSchema.js"
import UserSchema from "./entities/UserSchema.js"
import WordListSchema from "./entities/WordListSchema.js"
import WordListTtfSchema from "./entities/WordListTtfSchema.js"


const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "./main.sqlite",
    synchronize: true,
    logging: true,
    entities: [CategorySchema, PostSchema, JobSchema, MessagingSchema, PreferenceSchema, SocketSessionSchema, TtsProjectSchema, TtsSentenceSchema, UserSchema, WordListSchema, WordListTtfSchema],
    subscribers: [],
    migrations: [],
})
AppDataSource.initialize()
.then(() => {
  console.log("Berhasil inilize ")
})
.catch((error) => console.log(error))

export {AppDataSource}