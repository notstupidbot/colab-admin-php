import express from 'express'

import {datasource} from "./data-source/index.js"
datasource.initialize()
const app = express();

app.get("/api/cms/hello", (req, res) => {
  res.json({ hello: "world" })
});

export const handler = app