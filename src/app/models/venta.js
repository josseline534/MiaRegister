'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

const VentaSchema = new Schema({
    codigo: String,
    fecha: Date,
    total: String,
    productos:[
        {
            id:{
                type: Schema.ObjectId,
                ref: "product"
            },
            cantidad: Number,
            total:String
        }
    ],
    promocion:[
        {
            id:{
                type: Schema.ObjectId,
                ref: "promociones"
            },
            cantidad:Number,
            total:String
        }
    ],
    total:String,
    user:{
        type: Schema.ObjectId,
        ref: "user"
    }
})

module.exports = mongoose.model('venta', VentaSchema)