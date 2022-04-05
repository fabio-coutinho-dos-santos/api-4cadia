const mongoose = require("mongoose")
const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env

mongoose.Promise = global.Promise
const url =  process.env.DB_NAME ? `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin` : "mongodb://localhost/db_gate"

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	autoIndex: false, // Don't build indexes
	reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
	reconnectInterval: 500, // Reconnect every 500ms
	poolSize: 10, // Maintain up to 10 socket connections
	bufferMaxEntries: 0,
	connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
	socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
	family: 4 // Use IPv4, skip trying IPv6
}

module.exports = mongoose.createConnection(url, options, function (err) {
	if (err) {
		console.log ("ERROR connecting to: " + url + ". " + err)
	} else {
		console.log ("Succeeded connected to: " + url)
    
	}
}) 
  
mongoose.connect(url,options)

mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório"
mongoose.Error.messages.Number.min = "O '{VALUE}' informado é menor que o limite mínimo de '{MIN}'!"
mongoose.Error.messages.Number.max = "O '{VALUE}' informado é maior que o limite máximo de '{MAX}'!"
