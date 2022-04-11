const express = require("express")
const auth = require("../Model/User/auth")

module.exports = function(server)
{

	//==============================================routes opened to login, register and validate token of user //==============================================
	const openApi = express.Router()
	server.use("/oapi",openApi)

	const authService = require("../Model/User/authService")
	openApi.post("/signup",authService.signup)
	openApi.post("/login",authService.login)
	openApi.post("/validateToken",authService.validateToken)

	//==========================================================================================================================================================

	//================================================ protected routes to get informations from application ====================================================

    
	const protectedApi = express.Router()
	server.use("/api",protectedApi)
	protectedApi.use(auth)

	const userService = require("../Model/User/userService")
	userService.register(protectedApi,"/user")

	const operationService = require("../Model/Operation/operationService")
	operationService.register(protectedApi,"/operation")

	//==========================================================================================================================================================


}