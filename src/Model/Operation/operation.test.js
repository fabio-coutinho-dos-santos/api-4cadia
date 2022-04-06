/* eslint-disable no-undef */
const request = require("supertest")
const URL_TEST = "localhost:3000"

beforeAll(()=>{
	// const User = require("../User/user")
	// User.remove({}).exec() //clean database before register the user
})


//====================================================================== Save Operation tests ==================================================================================


test("Test Save Operation",()=>{
	return request (URL_TEST)
		.post("/api/operation/save")
		.send({
			code:"1234",
			description:"Test",
			amount:50,
			date:"05/06/2022",
			type:"Credit"
		})
		.then(response => {
			expect(response.status).toBe(201)
			expect(response.body._id).toBeDefined()
			expect(response.body.code).toBe("1234")
			expect(response.body.description).toBe("Test")
			expect(response.body.amount).toBe(50)
			expect(response.body.date).toBe("05/06/2022")
			expect(response.body.type).toBe("Debit")
		})
})
