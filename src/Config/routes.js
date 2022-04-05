const express = require("express")
const auth = require("../Model/User/auth")

module.exports = function(server)
{
	const openApi = express.Router()
	server.use("/oapi",openApi)
    
	const protectedApi = express.Router()
	server.use("/api",protectedApi)
	protectedApi.use(auth)

	const authService = require("../Model/User/authService")
	openApi.post("/signup",authService.signup)
	openApi.post("/login",authService.login)
	openApi.post("/validateToken",authService.validateToken)

	// const deviceService = require('../Device/deviceService')
	// deviceService.register(protectedApi,'/device')

}