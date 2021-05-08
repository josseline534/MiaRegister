'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

const CompraSchema = new Schema({
    codigo: String,
    fecha: Date,
    total: String,
    iva: String,
    subtotal: String,
    proveedor: String,
    productos:[
        {
            producto:
            {
                id:
                {
                    type: Schema.ObjectId,
                    ref: "product"
                },
                detalle:String,
                cantidad: Number,
                precioTotal: String
            }
        }
    ]
})

module.exports = mongoose.model('compra', CompraSchema)