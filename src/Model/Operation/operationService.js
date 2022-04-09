const Operation = require("./operation")
const lodash = require("lodash")

Operation.methods(["get", "put", "delete"])
Operation.updateOptions({ new: true, runValidators: true })

Operation.after("put", sendErrorsOrNext)

function sendErrorsOrNext(req, resp, next) {
	const bundle = resp.locals.bundle

	if (bundle.errors) {
		var errors = parseErrors(bundle.errors)
		resp.status(500).json({ errors })
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
				return resp.status(400).json({ errors: [err] })
			} else {
				resp.status(201).json(newOperation)
			}
		})
	}else if (validateDate(date) && !validatenHour(hour)){
		return resp.status(400).json({ errors: "Invalid hour" })
	}else if (!validateDate(date) && validatenHour(hour)){
		return resp.status(400).json({ errors: "Invalid date" })
	}else if (!validateDate(date) && !validatenHour(hour)){
		return resp.status(400).json({ errors: "Invalid date and hour" })
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

	let sumCredit = 0
	let sumDebit = 0
	calculateTotalCredit().then((sum) => {
		sumCredit = sum.sumCredit
		calculateTotalDebit().then((sum) => {
			sumDebit = sum.sumDebit
			calculateBalance(sumCredit, sumDebit, resp)
		})
	})
})

let calculateTotalCredit = (resp) => {

	return new Promise(resolve => {
		Operation.aggregate([
			{ $match: { type: "Credit" } },
			{
				$group: {
					_id: null,
					sumCredit: { $sum: "$amount" }
				}
			}, { $project: { _id: 0, sumCredit: 1 } }
		],
		function (err, sumCredit) {
			if (err) {
				return resp.status(500).json({ errors: [err] })
			} else {
				resolve(sumCredit[0])
			}
		})
	})
}

let calculateTotalDebit = (resp) => {
	return new Promise(resolve => {
		Operation.aggregate([
			{ $match: { type: "Debit" } },
			{
				$group: {
					_id: null,
					sumDebit: { $sum: "$amount" }
				}
			}, { $project: { _id: 0, sumDebit: 1 } }
		],
		function (err, sumDebit) {
			if (err) {
				return resp.status(500).json({ errors: [err] })
			} else {
				resolve(sumDebit[0])
			}
		})
	})
}

let calculateBalance = (sumCredit, sumDebit, resp) => {
	let balance = sumCredit - sumDebit
	resp.status(200).json({ balance: balance })
}

// ============================================================================ Functions to calculate balance =====================================================================================

Operation.route("getStatementByDate", (req, resp) => {

	const month = req.query.month
	const year = req.query.year

	let regex = new RegExp("" + month + "/.*/" + year)

	Operation.find((err, operation) => {
		if (err) {
			return resp.status(500).json({ errors: [err] })
		} else if (operation) {
			Operation.aggregate([
				{ $match: { date: regex } },
				{ $sort: { date: 1, hour: 1 } }], function (err, result) {
				if (err) {
					return resp.status(800).json({ errors: [err] })
				} else {
					resp.status(200).json(result)
				}
			})
		} else {
			return resp.status(400).send({ errors: ["Error on to get statement"] })
		}
	})
})


module.exports = Operation