'use strict'

const mongoose = require('mongoose')
let Schema = mongoose.Schema

let ProductSchema = Schema({
    detalle:{
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    precioUnit: String,
    iva: String,
    ganancia: Number,
    precioVenta: String,

})
module.exports= mongoose.model('product', ProductSchema)