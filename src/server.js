import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {config} from 'dotenv'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import databaseConnection from './lib/db.js'
import http from 'http'
import {Server} from 'socket.io'
config()
const app = express()
const PORT = process.env.PORT
const server = https.createServer(app )

//middlewares
app.use(express.json({limit : "10mb"}))
app.use(express.urlencoded({extended : true}))
app.use(cors({origin : "http://localhost:3001" , credentials : true}))
app.use(cookieParser())

//route middleware for authentication
app.use("/auth" , authRoutes)
//route middleware for messages
app.use("/message" , messageRoutes)

//socket io implementaion
const io = new Server(server , {
    cors : {
        origin : "http://localhost:3001",
        methods : ["GET" , "POST"]
    }
})

io.on("connection" , (socket) => {

    console.log("User connected id : " , socket.id)

    socket.on("send-message" , (chat) => {

        io.emit("receive-message" , chat)
    })

    socket.on("disconnect" , () => {
        console.log("User disconnected id : " , socket.id)
    })
})

server.listen(PORT , () => {
    console.log(`Server Running on ${PORT}`)
    
    databaseConnection()
})
