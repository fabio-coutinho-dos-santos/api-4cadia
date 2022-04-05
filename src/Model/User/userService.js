const User = require('./user')
const lodash = require('lodash')

User.methods(['get','post','put','delete'])
User.updateOptions({new:true, runValidators: true}) //necessário para retornar sempre o novo objeto e tambem validar os dados no método put

User.after('post',sendErrorsOrNext).after('put',sendErrorsOrNext)

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


module.exports = User