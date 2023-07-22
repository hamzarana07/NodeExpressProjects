const express = require("express")
const app = express();
const productsRouter = require("./routes/products")
const connectDB = require("./db/connect")
require("dotenv").config()
const notFoundMiddleware = require("./middleware/not-found")

app.use(express.json())

app.use("/api/v1/products", productsRouter)
app.use(notFoundMiddleware)


const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(8000, ()=>{
            console.log("App listening on: http://localhost:8000/api/v1/products")
        })
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

start()