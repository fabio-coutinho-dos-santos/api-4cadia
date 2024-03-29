const port = 3001
const bodyParser = require("body-parser")
const express = require("express")
const server = express()
const allowCors = require("./cors")
const queryParser = require("express-query-int")
const swaggerUi = require("swagger-ui-express")
const swaggerFile = require("../../swagger_output.json")

server.use(bodyParser.urlencoded({extended:true}))
server.use(bodyParser.json())
server.use(queryParser())
server.use(allowCors)
server.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile))

try{
	server.listen(process.emit.SERVER_PORT||port,()=>{
		console.log("Backend running on port " + port)
	})	
}catch(error){
	throw new Error(error.message)
}


module.exports = server