const User = require("./user")
const lodash = require("lodash")
const HttpStatusCode = require("../../Untils/HttpStatusCodes")

// Generate methods get, put and delete automatically to operations route
User.methods(["get","put","delete"])
User.updateOptions({new:true, runValidators: true})
User.after("put",sendErrorsOrNext)

function sendErrorsOrNext(req, resp, next){
	const bundle = resp.locals.bundle

	if(bundle.errors){
		var errors = parseErrors(bundle.errors)
		resp.status(HttpStatusCode.code.INTERNAL_SERVER).json({errors})
	}else{
		next()
	}
}

function parseErrors(nodeRestfulErrors)
{
	const errors = [] 
	lodash.forIn(nodeRestfulErrors, error=>{
		errors.push(error.message)
	})

	return errors
}


module.exports = User