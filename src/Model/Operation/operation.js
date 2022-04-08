const restful = require("node-restful")
const mongoose = restful.mongoose

const OperationSchema = new mongoose.Schema({
	code: {type: String, unique:true, required: true},
	description: {type: String, required: true},
	amount: {type: Number, required: true},
	date: {type: String, required: true},
	hour: {type: String, required: true},
	type:{type:String,required:true,
		enum: {
			values:["Credit","Debit"]
		}
	},
})

module.exports = restful.model("Operation",OperationSchema)