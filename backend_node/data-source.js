import {DataSource} from 'typeorm'
import JobSchema from "./entities/JobSchema.js"
import MessagingSchema from "./entities/MessagingSchema.js"
import PreferenceSchema from "./entities/PreferenceSchema.js"
import SocketSessionSchema from "./entities/SocketSessionSchema.js"
import TtsProjectSchema from "./entities/TtsProjectSchema.js"
import TtsSentenceSchema from "./entities/TtsSentenceSchema.js"
import UserSchema from "./entities/UserSchema.js"
import WordListSchema from "./entities/WordListSchema.js"
import WordListTtfSchema from "./entities/WordListTtfSchema.js"
import 'dotenv/config'

const database = process.env.DB_PATH

const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database,
    synchronize: true,
    logging: 0,
    entities: [JobSchema, MessagingSchema, PreferenceSchema, SocketSessionSchema, TtsProjectSchema, TtsSentenceSchema, UserSchema, WordListSchema, WordListTtfSchema],
    subscribers: [],
    migrations: [],
})

export {AppDataSource}