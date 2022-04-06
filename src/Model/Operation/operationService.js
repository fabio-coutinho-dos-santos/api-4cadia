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
			resp.status(201).json(newOperation)
		}
	})
})

// ============================================================================ Functions to calculate balance =====================================================================================

Operation.route("balance",(req,resp)=>{

	let sumCredit=0
	let sumDebit=0
	calculateTotalCredit().then((sum)=>{
		sumCredit = sum.sumCredit
		calculateTotalDebit().then((sum)=>{
			sumDebit = sum.sumDebit
			calculateBalance(sumCredit,sumDebit,resp)
		})
	})	
})

let calculateTotalCredit = (resp) =>{

	return new Promise(resolve =>{
		Operation.aggregate([
			{$match:{type:"Credit"}},
			{$group:{
				_id:null,
				sumCredit:{$sum:"$amount"}
			}},{$project:{_id:0,sumCredit:1}}
		],
		function (err,sumCredit) {
			if(err) {
				return resp.status(500).json({errors:[err]})
			}else{
				resolve(sumCredit[0])
			}
		})
	})
}

let calculateTotalDebit = (resp) =>{
	return new Promise(resolve =>{
		Operation.aggregate([
			{$match:{type:"Debit"}},
			{$group:{
				_id:null,
				sumDebit:{$sum:"$amount"}
			}},{$project:{_id:0,sumDebit:1}}
		],
		function (err,sumDebit) {
			if(err) {
				return resp.status(500).json({errors:[err]})
			}else{
				resolve(sumDebit[0])
			}
		})
	})
}

let calculateBalance = (sumCredit,sumDebit,resp) => {
	let balance = sumCredit-sumDebit
	resp.status(200).json({balance:balance})
}

// ============================================================================ Functions to calculate balance =====================================================================================


module.exports = Operation