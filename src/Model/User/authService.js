const lodash = require("lodash")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("./user")
const env = require("../../Config/constants")
const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z]).{6,12})/
const HttpStatusCode = require("../../Untils/HttpStatusCodes")

// catch and send typical db-related errors
const sendErrorsFromDB = (res, dbErrors) => {
	const errors = []
	lodash.forIn(dbErrors.errors, error => errors.push(error.message))
	return res.status(HttpStatusCode.code.BAD_REQUEST).json({errors})
}


const login = (req, res) => {
	try{
		const email = req.body.email || ""
		const password = req.body.password || ""

		User.findOne({email}, (err, user) => {
			if(err) {
				return sendErrorsFromDB(res, err)
			// use bcrypt to compare the sent password with the encrypted stored one
			} else if (user && bcrypt.compareSync(password, user.password)) {
				//uses authSecret variable to generate JWT token
				const token = jwt.sign(user, env.authSecret, {
					//set 10 days to expirate jwt token
					expiresIn: "10 day"})
				const {_id, name, email} = user
				res.json({_id, name, email, token })
			} else {
				return res.status(HttpStatusCode.code.BAD_REQUEST).send({errors: ["Invalid user or password"]})
			}
		})
	}catch(error){
		throw new Error (error.message)
	}
}

const validateToken = (req, res) => {
	try{
		const token = req.body.token || ""
		jwt.verify(token, env.authSecret, function(err) {
			return res.status(HttpStatusCode.code.OK).send({valid: !err})
		})
	}catch(error){
		throw new Error (error.message)
	}
	
}

const signup = (req, res, next) => {
	try{
		const name = req.body.name || ""
		const email = req.body.email || ""
		const password = req.body.password || ""
		const confirmPassword = req.body.confirmPassword || ""

		if(!email.match(emailRegex)) {
			return res.status(HttpStatusCode.code.BAD_REQUEST).send({errors: ["Invalid email"]})
		}

		if(!password.match(passwordRegex)) {
			return res.status(HttpStatusCode.code.PASSWORD_INVALID).send({errors: [
				"Invalid password"
			]})
		}

		const salt = bcrypt.genSaltSync()
		const passwordHash = bcrypt.hashSync(password, salt)
		if(!bcrypt.compareSync(confirmPassword, passwordHash)) {
			return res.status(HttpStatusCode.code.PASSWORD_DIFFFERENT).send({errors: ["Passwords don't match"]})
		}

		User.findOne({email}, (err, user) => {
            
			if(err) {
				return sendErrorsFromDB(res, err)
			} else if (user) {
				return res.status(HttpStatusCode.code.FORBIDDEN).send({errors: ["This user is already registered"]})
			} else {
				const newUser = new User({ name, email, password: passwordHash})
				newUser.save(err => {
					if(err) {
						return sendErrorsFromDB(res, err)
					} else {
						login(req, res, next)
					}
				})
			}
		})
	}catch(error){
		throw new Error (error.message)
	}
}



module.exports = { login, signup, validateToken }