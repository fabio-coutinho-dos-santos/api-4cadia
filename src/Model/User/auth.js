const jwt = require("jsonwebtoken")
const env = require("../../Config/constants")

module.exports = (req, resp, next) => 
{
	if(req.method === "OPTIONS"){
		next()
	}else{
		const token = req.body.token || req.query.token || req.headers["authorization"]

		if(!token){
			return resp.status(403).send({errors:["No token provide"]})
		}

		jwt.verify(token, env.authSecret, function(err){
			if(err){
				return resp.status(403).send({
					errors:["Failed to authenticate token."]
				})
			}else{
				next()
			}
		})
	}
}
