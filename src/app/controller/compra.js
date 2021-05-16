'use strict'

const e = require('express')
let validator = require('validator')

const Compra = require('../models/compra')
const Product = require('../models/producto')

let controller ={
    compras: async(req, res)=>{
        if(req.isAuthenticated()){
            const compras = await Compra.find()
            res.render('compras',{
                user: req.user,
                compras,
                message: ''
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
        }catch(error){
            console.log(`ERROR COMPRA: ${error}`);
            req.flash('failedCompra','Faltan campos por llenar')
            res.render('newCompra',{
                user: req.user
            })
        }
        if(codigo && proveedor){
            let newCompra = new Compra()
            newCompra.codigo = req.body.codigo
            newCompra.proveedor = req.body.proveedor
            newCompra.fecha = req.body.fecha
            newCompra.total = req.body.total
            newCompra.iva = req.body.iva
            newCompra.subtotal = req.body.subTotal
            newCompra.save((error)=>{
                if(error){
                    console.log(`ERROR ${error}`);
                    req.flash('failedCompra','No se guardo la compra')
                }else{
                    res.render('newProducto', {
                        user: req.user,
                        newCompra,
                        message: 'Compra registrada correctamente',

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
                    message: 'No se pudo eliminar el producto de la factura',
                })
            }else{
                res.render('newProducto', {
                    user: req.user,
                    newCompra,
                    message: 'Producto eliminado correctamente',
                })
            }
        })
    },
    edit: async(req, res) =>{
        let prod = await Product.findById({_id: req.params.idProducto})
        console.log(prod);
        let newCompra = await Compra.findById({_id: req.params.idCompra})
        res.render('prodEdit', {
            user: req.user,
            newCompra,
            message: '',
            prod,
            cant: req.params.cant,
            idObjProd: req.params.id
        })
    },
    update:async(req, res) =>{
        //Calculo de IVA y Precio de Venta
        let pUnit = parseFloat((req.body.pUnit))
        let iva = pUnit * 0.12
        let pVenta = ((pUnit + iva)* 0.5)+(pUnit + iva)
        await Compra.updateOne({_id: req.params.idCompra, "productos._id": req.params.idObjProd},{
            $set:{
                "productos.$":{
                    producto:{
                        detalle:req.body.detail,
                        cantidad:req.body.cantidad,
                        precioTotal:pUnit*req.body.cantidad,
                    }
                }
            }
        }, async(error)=>{
            if(error){
                console.log(error);
                let newCompra= await Compra.findById({_id: req.params.idCompra})
                res.render('newProducto', {
                    user: req.user,
                    newCompra,
                    message: 'No se pudo editar el producto de la factura',
                })
            }else{
                let prod = await Product.findById({_id:req.params.idProd})
                console.log(parseInt((prod.stock)));
                await Product.updateOne({_id: req.params.idProd},{
                    detalle: req.body.detail,
                    stock: parseInt((prod.stock))-parseInt((req.params.cant))+parseInt((req.body.cantidad)),
                    precioUnit: pUnit,
                    iva: iva,
                    precioVenta: pVenta
                }, async(error)=>{
                    if(error){
                        console.log(error);
                    }else{
                        let newCompra= await Compra.findById({_id: req.params.idCompra})
                        res.render('newProducto', {
                            user: req.user,
                            newCompra,
                            message: 'Producto actualizado',
                        })
                    }
                })
            }
        })
    },
    detail: async(req, res)=>{
        await Compra.findById({_id: req.params.id}, async(error, compra)=>{
            if(error){
                let compras = await Compra.find()
                res.render('compras',{
                    user: req.user,
                    compras
                })
            }
            if(compra){
                var total = 0
                for(let i=0; i < compra.productos.length; i++){
                    console.log(parseFloat(compra.productos[i].producto.precioTotal));
                    let precioTotal = parseFloat(compra.productos[i].producto.precioTotal)
                    total = total + precioTotal
                    console.log(total);
                }
                res.render('detalleCompra',{
                    user: req.user,
                    compra,
                    total
                })
            }
        })
    },
    search: async(req, res)=>{
        console.log(req.body.search);
        await Compra.find({
            "$or":[
                {
                    "codigo":{
                        "$regex":req.body.search,
                        "$options": "i"
                    }
                },
                {
                    "proveedor":{
                        "$regex":req.body.search,
                        "$options": "i"
                    }
                },
                {
                    "productos.producto.detalle":{
                        "$regex":req.body.search,
                        "$options": "i"
                    }
                }
            ]
        }).sort([['date','descending']])
        .exec(async (error, compras) => {
            if(error){
                console.log(error);
                const compras = await Compra.find()
                res.render('compras',{
                    user: req.user,
                    compras,
                    message: 'Ocurrio un error al conectarse con la base de datos'
                })
            }
            if(!compras || compras.length <= 0){
                const compras = await Compra.find()
                res.render('compras',{
                    user: req.user,
                    compras,
                    message: 'No existen facturas que coincidan con la búsqueda'
                })
            }
            if(compras){
                res.render('compras',{
                    user: req.user,
                    compras,
                    message: ''
                })
            }
        })
    }
}

module.exports = controller