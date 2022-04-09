/* eslint-disable no-undef */
const request = require("supertest")
const URL_TEST = "localhost:3000"
const HttpStatusCode = require("../../Untils/HttpStatusCodes")

let token=""

//====================================================================== Register tests ==================================================================================


test("Test Register User registered",()=>{
	return request (URL_TEST)
		.post("/oapi/signup")
		.send({

			name:"Fabio Coutinho",
			email:"fabio.santcou@gmail.com",
			password:"S@ntcou90",
			confirmPassword:"S@ntcou90"
		})
		.then(response => {

			if(response.status!=200){
				expect(response.status).toBe(HttpStatusCode.code.FORBIDDEN) // if User already registered
			}else{
				expect(response.status).toBe(HttpStatusCode.code.OK)
				expect(response.body._id).toBeDefined()
				expect(response.body.token).toBeDefined()
				expect(response.body.name).toBe("Fabio Coutinho")
				expect(response.body.email).toBe("fabio.santcou@gmail.com")
				token = response.body.token
			}
		})
})


test("Test Register User with different passwords",()=>{
	return request (URL_TEST)
		.post("/oapi/signup")
		.send({

			name:"Fabio Coutinho",
			email:"fabio.santcou@gmail.com",
			password:"S@ntcou90",
			confirmPassword:"S@ntcou9"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCode.code.BAD_REQUEST)
		})
})


//==============================================================================================================================================================================

//====================================================================== Login tests ==================================================================================

test("Test Login with User registered",()=>{
	return request (URL_TEST)
		.post("/oapi/login")
		.send({
			email:"fabio.santcou@gmail.com",
			password:"S@ntcou90"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCode.code.OK)
			expect(response.body._id).toBeDefined()
			expect(response.body.name).toBe("Fabio Coutinho")
			expect(response.body.token).toBeDefined()
			expect(response.body.email).toBe("fabio.santcou@gmail.com")
			token = response.body.token
		})
})

test("Test login with wrong Password registered",()=>{
	return request (URL_TEST)
		.post("/oapi/login")
		.send({
			email:"fabio.santcou@gmail.com",
			password:"S@ntcou9"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCode.code.BAD_REQUEST)
		})
})

test("Test login with wrong email registered",()=>{
	return request (URL_TEST)
		.post("/oapi/login")
		.send({
			email:"fabio.santcou@gail.com",
			password:"S@ntcou90"
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCode.code.BAD_REQUEST)
		})
})

//==============================================================================================================================================================================

//====================================================================== Validate Token tests ==================================================================================

test("Test Validate Token User with valid token",()=>{
	return request (URL_TEST)
		.post("/oapi/validateToken")
		.send({
			token:token,
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCode.code.OK)
			expect(response.body.valid).toBe(true)
		})
})

test("Test Validate Token User with unvalid token",()=>{
	return request (URL_TEST)
		.post("/oapi/validateToken")
		.send({
			token:"sdfsdfisi9990898d7fsd8f7sdf",
		})
		.then(response => {
			expect(response.status).toBe(HttpStatusCode.code.OK)
			expect(response.body.valid).toBe(false)
		})
})

//=====================================================================================================================================================================