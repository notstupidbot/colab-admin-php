import {EntitySchema} from "typeorm"  
import Job from "../models/Job.js"  

/*
   this.subscriber_id = subscriber_id
        this.params = params
        this.name = name
        this.cmdline = cmdline
        this.ps_output = ps_output
        this.pid = pid
        this.create_data = create_data
        this.last_updated = last_updated
*/

const JobSchema = new EntitySchema({
    name: "Job",
    target: Job,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        subscriber_id: {
            type: "varchar"
        },
        params: {
            type: "text"
        },
        name: {
            type: "varchar"
        },
        cmdline: {
            type: "text",
            nullable: true,

        },
        ps_output: {
            type: "text",
            nullable: true,

        },
        pid: {
            type: "int",
            nullable: true,

        },
        create_date: {
            type: "datetime",
            nullable: true,

        },
        last_updated: {
            type: "datetime",
            nullable: true,

        }
    }
})

export default JobSchema