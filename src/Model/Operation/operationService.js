const Operation = require("./operation")
const lodash = require("lodash")

Operation.methods(["get","put","delete"])
Operation.updateOptions({new:true, runValidators: true})

Operation.after("put",sendErrorsOrNext)

function sendErrorsOrNext(req, resp, next){
	const bundle = resp.locals.bundle

	if(bundle.errors){
		var errors = parseErrors(bundle.errors)
		resp.status(500).json({errors})
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

Operation.route("save", (req,resp)=>{

	const code = req.body.code
	const description = req.body.description
	const amount = req.body.amount
	const date = req.body.date
	const type = req.body.type
	
	const newOperation = new Operation({code,description,amount,date,type})

	newOperation.save(err=>{
		if(err){
			return resp.status(400).json({errors:[err]})
		}else{
			resp.status(200).json(newOperation)
		}
	})
})


module.exports = Operation