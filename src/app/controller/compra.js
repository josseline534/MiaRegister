'use strict'

let validator = require('validator')

const Compra = require('../models/compra')
const Product = require('../models/producto')

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
    },
    delete:async(req, res)=>{
        const idCompra = req.params.idCompra
        const idProducto = req.params.idProducto
        const cantidad = req.params.cant
        //Buscar el producto
        let prod = await Product.findById({_id: idProducto})
        //Actualizar Stock del producto
        await Product.updateOne({_id:idProducto},{
            stock: parseInt(prod.stock) - parseInt(cantidad)
        })
        //Eliminar producto de la factura o compra
        await Compra.updateOne({_id : idCompra},{
            $pull:{
                'productos':{
                    _id:req.params.id
                }
            }
        }, async(error)=>{
            let newCompra = await Compra.findById({_id: idCompra})
            if(error){
                console.log(`ERROR PRODUCTO DELETE COMPRA: ${error}`);
                res.render('newProducto', {
                    user: req.user,
                    newCompra,
                    message: 'No se pudo eliminar el producto de la factura'
                })
            }else{
                res.render('newProducto', {
                    user: req.user,
                    newCompra,
                    message: 'Producto eliminado correctamente'
                })
            }
        })
    }
}

module.exports = controller