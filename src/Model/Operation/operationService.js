const Operation = require("./operation")
const lodash = require("lodash")
const HttpStatusCode = require("../../Untils/HttpStatusCodes")

Operation.methods(["get", "put", "delete"])
Operation.updateOptions({ new: true, runValidators: true })

Operation.after("put", sendErrorsOrNext)

function sendErrorsOrNext(req, resp, next) {
	const bundle = resp.locals.bundle

	if (bundle.errors) {
		var errors = parseErrors(bundle.errors)
		resp.status(HttpStatusCode.code.INTERNAL_SERVER).json({ errors })
	} else {
		next()
	}
}

function parseErrors(nodeRestfulErrors) {
	const errors = []
	lodash.forIn(nodeRestfulErrors, error => {
		errors.push(error.message)
	})

	return errors
}

Operation.route("save", (req, resp) => {

	try{
		const idUser = req.body.idUser
		const code = req.body.code
		const description = req.body.description
		const amount = req.body.amount
		const date = req.body.date
		const hour = req.body.hour
		const type = req.body.type

		if (validateDate(date) && validatenHour(hour)){
			const newOperation = new Operation({ idUser, code, description, amount, date, hour, type })

			newOperation.save(err => {
				if (err) {
					return resp.status(HttpStatusCode.code.BAD_REQUEST).json({ errors: [err] })
				} else {
					resp.status(HttpStatusCode.code.POST_OK).json(newOperation)
				}
			})
		}else if (validateDate(date) && !validatenHour(hour)){
			return resp.status(HttpStatusCode.code.BAD_REQUEST).json({ errors: "Invalid hour" })
		}else if (!validateDate(date) && validatenHour(hour)){
			return resp.status(HttpStatusCode.code.BAD_REQUEST).json({ errors: "Invalid date" })
		}else if (!validateDate(date) && !validatenHour(hour)){
			return resp.status(HttpStatusCode.code.BAD_REQUEST).json({ errors: "Invalid date and hour" })
		}
	}catch(error){
		throw new Error (error.message)
	}
	

	
})

let validateDate = (date) => {

	try {
		var aux = date.split("/")
		var month = parseInt(aux[0])
		var day = parseInt(aux[1])
		var year = parseInt(aux[2])

		if (month > 12 || month < 0) {
			return false
		}

		if (day > 31 || day < 0) {
			return false
		}else if(month == 2 && day > 29){
			return false
		}else if((month == 4 || month == 6 || month == 9 || month == 11) && day > 30){
			return false
		}

		if(year > 2030 || year < 2000){
			return false
		}

		return true

	} catch (e) {
		console.log(e)
		return false
	}
}

let validatenHour = (hourComplete) => {
	var aux = hourComplete.split(":")
	var hour = parseInt(aux[0])
	var minutes = parseInt(aux[1])
	try {
		if(hour < 0 || hour > 23){
			return false
		}
		else if(minutes < 0 || minutes > 59){
			return false
		}
		else{
			return true
		}
	}catch(e){
		console.log(e)
		return false
	}
}

// ============================================================================ Functions to calculate balance =====================================================================================

Operation.route("balance", (req, resp) => {
	try{
		const idUser = req.query.idUser
		let sumCredit = 0
		let sumDebit = 0
		calculateTotalCredit(resp,idUser).then((sum) => {
			sumCredit = sum.sumCredit || 0
			calculateTotalDebit(resp,idUser).then((sum) => {
				sumDebit = sum.sumDebit || 0
				calculateBalance(sumCredit, sumDebit, resp)
			})
		})
	}catch(error){
		throw new Error(error.message)
	}
})

let calculateTotalCredit = (resp,idUser) => {

	
	return new Promise(resolve => {
		try{
			Operation.aggregate([
				{ $match: { type: "Credit" } },
				{ $match: { idUser: idUser } },
				{
					$group: {
						_id: null,
						sumCredit: { $sum: "$amount" }
					}
				}, { $project: { _id: 0, sumCredit: 1 } }
			],
			function (err, sumCredit) {
				if (err) {
					return resp.status(HttpStatusCode.INTERNAL_SERVER).json({ errors: [err] })
				} else {
					resolve(sumCredit[0]||0)
				}
			})
		}catch(error){
			return resp.status(HttpStatusCode.INTERNAL_SERVER).json({ errors: [error.message] })
		}
	})
}

let calculateTotalDebit = (resp,idUser) => {
	return new Promise(resolve => {
		try{
			Operation.aggregate([
				{ $match: { type: "Debit" } },
				{ $match: { idUser: idUser } },
				{
					$group: {
						_id: null,
						sumDebit: { $sum: "$amount" }
					}
				}, { $project: { _id: 0, sumDebit: 1 } }
			],
			function (err, sumDebit) {
				if (err) {
					return resp.status(HttpStatusCode.INTERNAL_SERVER).json({ errors: [err] })
				} else {
					resolve(sumDebit[0]||0)
				}
			})
		}catch(error){
			return resp.status(HttpStatusCode.INTERNAL_SERVER).json({ errors: [error.message] })
		}
	})
}

let calculateBalance = (sumCredit, sumDebit, resp) => {
	let balance = sumCredit - sumDebit
	resp.status(HttpStatusCode.code.OK).json({ balance: balance })
}

// ============================================================================ Functions to calculate balance =====================================================================================

Operation.route("getStatementByDate", (req, resp) => {

	try{
		const month = req.query.month
		const year = req.query.year

		let regex = new RegExp("" + month + "/.*/" + year)

		Operation.find((err, operation) => {
			if (err) {
				return resp.status(HttpStatusCode.code.INTERNAL_SERVER).json({ errors: [err] })
			} else if (operation) {
				Operation.aggregate([
					{ $match: { date: regex } },
					{ $sort: { date: 1, hour: 1 } }], function (err, result) {
					if (err) {
						return resp.status(HttpStatusCode.code.INTERNAL_SERVER).json({ errors: [err] })
					} else {
						resp.status(HttpStatusCode.code.OK).json(result)
					}
				})
			} else {
				return resp.status(HttpStatusCode.code.BAD_REQUEST).send({ errors: ["Error on to get statement"] })
			}
		})
	}catch(error){
		throw new Error(error.message)
	}
})


module.exports = Operation