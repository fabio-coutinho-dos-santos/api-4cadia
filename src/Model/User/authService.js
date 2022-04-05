const lodash = require("lodash")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("./user")
const env = require("../../Config/constants")

const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z]).{6,12})/


const sendErrorsFromDB = (res, dbErrors) => {
	const errors = []
	lodash.forIn(dbErrors.errors, error => errors.push(error.message))
	return res.status(400).json({errors})
}

const login = (req, res) => {
	const email = req.body.email || ""
	const password = req.body.password || ""

	User.findOne({email}, (err, user) => {
		if(err) {
			return sendErrorsFromDB(res, err)
		} else if (user && bcrypt.compareSync(password, user.password)) {
			const token = jwt.sign(user, env.authSecret, {
				expiresIn: "10 day"})
			const {_id, name, email, profile} = user
			res.json({_id, name, email, profile , token })
		} else {
			return res.status(400).send({errors: ["User or Password invalid"]})
		}
	})
}

const validateToken = (req, res) => {
	const token = req.body.token || ""
	jwt.verify(token, env.authSecret, function(err) {
		return res.status(200).send({valid: !err})
	})
}

const signup = (req, res, next) => {
	const name = req.body.name || ""
	const email = req.body.email || ""
	const password = req.body.password || ""
	const confirmPassword = req.body.confirmPassword || ""
	const profile = "User"


	if(!email.match(emailRegex)) {
		return res.status(400).send({errors: ["O e-mail informado está inválido"]})
	}

	if(!password.match(passwordRegex)) {
		return res.status(401).send({errors: [
			"A senha precisar ter pelo menos um número e tamanho entre 6-12 caracteres."
		]})
	}

	const salt = bcrypt.genSaltSync()
	const passwordHash = bcrypt.hashSync(password, salt)
	if(!bcrypt.compareSync(confirmPassword, passwordHash)) {
		return res.status(402).send({errors: ["Senhas não conferem."]})
	}

	User.findOne({email}, (err, user) => {
            
		if(err) {
			return sendErrorsFromDB(res, err)
		} else if (user) {
			return res.status(403).send({errors: ["Usuário já cadastrado."]})
		} else {
			const newUser = new User({ name, email, password: passwordHash, profile})
			newUser.save(err => {
				if(err) {
					return sendErrorsFromDB(res, err)
				} else {
					login(req, res, next)
				}
			})
		}
	})
}



module.exports = { login, signup, validateToken }