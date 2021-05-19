'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

const promocionSchema = new Schema({
    codigo: String,
    detalle: String,
    stock: Number,
    precio: String,
    productos:[
        {
            id:{
                type: Schema.ObjectId,
                ref: "product"
            },
            cantidad: Number
        }
    ]
})

module.exports = mongoose.model('promociones', promocionSchema)