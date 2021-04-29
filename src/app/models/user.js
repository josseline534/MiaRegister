'use strict'

let mongoose = require("mongoose")
const bcrypt = require('bcrypt-nodejs')
let Schema = mongoose.Schema

let UserSchema = Schema({
    user:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    identify:{
        type: String,
        required:true
    },
    rol:{
        type: String,
        required: true
    }
})

// Encriptar
UserSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// Desencriptar
UserSchema.methods.validatePassword = (password, paswordCompare) => {
    return bcrypt.compareSync(password, paswordCompare)
}

module.exports = mongoose.model('user', UserSchema)