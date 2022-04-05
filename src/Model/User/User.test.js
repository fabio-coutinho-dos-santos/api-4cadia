/* eslint-disable no-undef */
const request = require("supertest")
const URL_TEST = "localhost:3000"


beforeAll(()=>{
	const User = require("../User/user")
	User.remove({}).exec()
})


//====================================================================== Register tests ==================================================================================


test("Test Register User registered",()=>{
	return request (URL_TEST)
		.post("/oapi/login")
		.send({

			naem:"Fabio Coutinho",
			email:"fabio.santcou@gmail.com",
			password:"S@ntcou90",
			confirmPassword:"S@ntcou90"
		})
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body._id).toBeDefined()
			expect(response.body.token).toBeDefined()
			expect(response.body.name).toBe("Fabio Coutinho")
			expect(response.body.email).toBe("fabio.santcou@gmail.com")
		})
})

//=====================================================================================================================================================================================

//====================================================================== Login tests ==================================================================================

test("Test Register with User registered",()=>{
	return request (URL_TEST)
		.post("/oapi/login")
		.send({
			email:"fabio.santcou@gmail.com",
			password:"S@ntcou90"
		})
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body._id).toBeDefined()
			expect(response.body.name).toBe("Fabio Coutinho")
			expect(response.body.token).toBeDefined()
			expect(response.body.email).toBe("fabio.santcou@gmail.com")
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
			expect(response.status).toBe(400)
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
			expect(response.status).toBe(400)
		})
})


//=====================================================================================================================================================================================
