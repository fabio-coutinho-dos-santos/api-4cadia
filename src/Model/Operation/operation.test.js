/* eslint-disable no-undef */
const request = require("supertest")
const URL_TEST = "localhost:3000"

let globalToken=""

beforeAll(()=>{
      
})


//====================================================================== Save Operation tests ==================================================================================

// to make login with user registered to get the token
test("Test Login with User registered",()=>{
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
			globalToken = response.body.token
		})

})

test("Test Save Operation",()=>{
	
	var commonHeaders = { 
		"authorization":globalToken,
	}

	return request (URL_TEST)
		.post("/api/operation/save")
		.set(commonHeaders)
		.send({
			idUser:"624d71ff3526da02eacab759",
			code:"1234",
			description:"Test",
			amount:50,
			date:"05/06/2022",
			hour:"20:00",
			type:"Credit"
		})
		.then(response => {
			expect(response.status).toBe(201)
			expect(response.body._id).toBeDefined()
			expect(response.body.idUser).toBe("624d71ff3526da02eacab759")
			expect(response.body.code).toBe("1234")
			expect(response.body.description).toBe("Test")
			expect(response.body.amount).toBe(50)
			expect(response.body.date).toBe("05/06/2022")
			expect(response.body.hour).toBe("20:00")
			expect(response.body.type).toBe("Credit")
		})
})

test("Test Save Operation with wrong hour",()=>{
	
	var commonHeaders = { 
		"authorization":globalToken,
	}

	return request (URL_TEST)
		.post("/api/operation/save")
		.set(commonHeaders)
		.send({
			idUser:"624d71ff3526da02eacab759",
			code:"1234",
			description:"Test",
			amount:50,
			date:"05/06/2022",
			hour:"24:00",
			type:"Credit"
		})
		.then(response => {
			expect(response.status).toBe(400)
		})
})

test("Test Save Operation with wrong minutes",()=>{
	
	var commonHeaders = { 
		"authorization":globalToken,
	}

	return request (URL_TEST)
		.post("/api/operation/save")
		.set(commonHeaders)
		.send({
			idUser:"624d71ff3526da02eacab759",
			code:"1234",
			description:"Test",
			amount:50,
			date:"05/06/2022",
			hour:"23:60",
			type:"Credit"
		})
		.then(response => {
			expect(response.status).toBe(400)
			expect(response.body.errors).toBe("Invalid hour")
		})
})

test("Test Save Operation with wrong day",()=>{
	
	var commonHeaders = { 
		"authorization":globalToken,
	}

	return request (URL_TEST)
		.post("/api/operation/save")
		.set(commonHeaders)
		.send({
			idUser:"624d71ff3526da02eacab759",
			code:"1234",
			description:"Test",
			amount:50,
			date:"05/32/2022",
			hour:"23:59",
			type:"Credit"
		})
		.then(response => {
			expect(response.status).toBe(400)
			expect(response.body.errors).toBe("Invalid date")

		})
})

test("Test Save Operation with wrong month",()=>{
	
	var commonHeaders = { 
		"authorization":globalToken,
	}

	return request (URL_TEST)
		.post("/api/operation/save")
		.set(commonHeaders)
		.send({
			idUser:"624d71ff3526da02eacab759",
			code:"1234",
			description:"Test",
			amount:50,
			date:"13/30/2022",
			hour:"23:59",
			type:"Credit"
		})
		.then(response => {
			expect(response.status).toBe(400)
			expect(response.body.errors).toBe("Invalid date")

		})
})

test("Test Save Operation with wrong date and time",()=>{
	
	var commonHeaders = { 
		"authorization":globalToken,
	}

	return request (URL_TEST)
		.post("/api/operation/save")
		.set(commonHeaders)
		.send({
			idUser:"624d71ff3526da02eacab759",
			code:"1234",
			description:"Test",
			amount:50,
			date:"13/30/2022",
			hour:"23:60",
			type:"Credit"
		})
		.then(response => {
			expect(response.status).toBe(400)
			expect(response.body.errors).toBe("Invalid date and hour")

		})
})

//==================================================================================================================================================================================================

//======================================================================================== Test calculate Balance ==================================================================================

test("Test Calculate balance",()=>{
	
	var commonHeaders = { 
		"authorization":globalToken,
	}

	return request (URL_TEST)
		.get("/api/operation/balance")
		.set(commonHeaders)
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body.balance).toBeDefined()
		})
})



test("Test Calculate balance with wron token",()=>{
	
	var commonHeaders = { 
		"authorization":"asdasdasdasd",
	}

	return request (URL_TEST)
		.get("/api/operation/balance")
		.set(commonHeaders)
		.then(response => {
			expect(response.status).toBe(403)
		})
})
//==================================================================================================================================================================================================

//======================================================================================== Test calculate Balance ==================================================================================

test("Test get statement by date",()=>{
	
	var commonHeaders = { 
		"authorization":globalToken,
	}

	return request (URL_TEST)
		.get("/api/operation/getStatementByDate?month=04&year=2022")
		.set(commonHeaders)
		.then(response => {
			expect(response.status).toBe(200)
		})
})

//==================================================================================================================================================================================================
