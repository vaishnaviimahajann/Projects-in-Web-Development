const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const routes = require("./routes")
app.use("/",routes)

app.listen(3000,()=>{
console.log("Server running on 3000")
})