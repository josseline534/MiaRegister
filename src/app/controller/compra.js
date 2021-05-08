'use strict'

let validator = require('validator')

const passport = require('../../config/passport')
const User = require('../models/user')
const Compra = require('../models/compra')

let controller ={
    compras: (req, res)=>{
        if(req.isAuthenticated()){
            res.render('compras',{
                user: req.user,
            })
        }else{
            res.redirect('/')
        }
    },
    formCompra: (req, res)=>{
        res.render('newCompra',{
            user: req.user,
        })
    },
    insert:(req, res)=>{
        try{
            var codigo = !validator.isEmpty(req.body.codigo)
            var proveedor = !validator.isEmpty(req.body.proveedor)
            var total = !validator.isFloat(req.body.total)
            var iva = !validator.isFloat(req.body.iva)
            var subtotal = !validator.isFloat(req.body.subTotal)
        }catch(error){
            console.log(`ERROR COMPRA: ${error}`);
            req.flash('failedCompra','Faltan campos por llenar')
            res.render('newCompra',{
                user: req.user
            })
        }
        if(codigo && proveedor &&
            total && iva && subtotal){
            let newCompra = new Compra()
            newCompra.codigo = req.body.codigo
            newCompra.proveedor = req.body.proveedor
            newCompra.fecha = req.body.fecha
            newCompra.total = req.body.total
            newCompra.iva = req.body.iva
            newCompra.subtotal = req.body.subtotal
            newCompra.save((error)=>{
                if(error){
                    req.flash('failedCompra','No se guardo la compra')
                }else{
                    res.render('newProducto', {
                        user: req.user,
                        newCompra,
                        message: 'Compra registrada correctamente'
                    })
                }
            })
        }else{
            req.flash('failedCompra','Los datos no son válidos o faltan campos por llenar')
            res.render('newCompra',{
                user: req.user
            })
        }
    }
}

module.exports = controller