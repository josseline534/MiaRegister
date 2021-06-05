'use strict'

let validator = require('validator')
const producto = require('../models/producto')

const Product = require('../models/producto')
const Promocion = require('../models/promocion')
const Venta = require('../models/venta')



let controller ={
    venta: async(req, res)=>{
        if(req.isAuthenticated()){
            let ventas = await Venta.find()
            res.render('venta', {
                user: req.user,
                ventas,
                messageFailed:'',
                message:''
            })
        }else
            res.redirect('/')
    },
    formVenta: async(req, res)=>{
        res.render('newVenta', {
            user: req.user,
            venta:{},
            producto:{},
            promocion:{},
            pedido:{},
            messageFailed:'',
            message:''
        })
    },
    search: async(req, res)=>{
        var producto = await Product.find({
            "$or":[
                {
                    "detalle":{
                        "$regex":req.body.search,
                        "$options": "i"
                    }
                },
            ]
        }).populate('productos.id')

        var promocion = await Promocion.find({
            "$or":[
                {
                    "detalle":{
                        "$regex":req.body.search,
                        "$options": "i"
                    }
                },
            ]
        }).populate('promocion.id')

        if(req.params.id != undefined){
            console.log(req.params.id);
            let venta = await Venta.findById({_id: req.params.id}).populate('productos.id').populate('promocion.id')
            console.log(venta);
            res.render('newVenta',{
                user: req.user,
                venta,
                producto,
                promocion,
                pedido:{},
                messageFailed:'',
                message:''
            })
        }else{
            res.render('newVenta',{
                user: req.user,
                venta:{},
                producto,
                promocion,
                pedido:{},
                messageFailed:'',
                message:''
            })
        }
    },
    llenarProm: async(req, res)=>{
        let pedido = await Promocion.findById({_id:req.params.idpromocion})
        if(req.params.idventa != undefined){
            let venta = await Venta.findById({_id:req.params.idventa}).populate('promocion.id').populate('productos.id')
            res.render('newVenta',{
                user: req.user,
                venta,
                producto:{},
                promocion:{},
                pedido,
                messageFailed:'',
                message:''
            })
        }else{
            res.render('newVenta',{
                user: req.user,
                venta:{},
                producto:{},
                promocion:{},
                pedido,
                messageFailed:'',
                message:''
            })
        }
    },
    llenarProd: async(req, res)=>{
        console.log(req.params);
        let pedido = await Product.findById({_id:req.params.idproducto})
        if(req.params.idventa != undefined){
            let venta = await Venta.findById({_id:req.params.idventa}).populate('productos.id').populate('promocion.id')
            console.log(venta);
            res.render('newVenta',{
                user: req.user,
                venta,
                producto:{},
                promocion:{},
                pedido,
                messageFailed:'',
                message:''
            })
        }else{
            res.render('newVenta',{
                user: req.user,
                venta:{},
                producto:{},
                promocion:{},
                pedido,
                messageFailed:'',
                message:''
            })
        }
    },
    add: async(req, res) =>{
        console.log(req.body);
        var producto = await Product.findOne({detalle:req.body.detalle})
        console.log(producto);
        // Verificar el producto o promocion para disminuir stock
        if(producto){
            if(producto.stock >= parseInt(req.body.cantidad)){
                await Product.updateOne({_id:producto._id},{
                    stock: producto.stock - parseInt(req.body.cantidad)
                })
            }
            else{
                res.render('newVenta',{
                    user: req.user,
                    venta:{},
                    producto:{},
                    promocion:{},
                    pedido:{},
                    messageFailed:'La cantidad supera el stock del producto',
                    message:''
                })
            }
        }else{
            var promocion = await Promocion.findOne({detalle:req.body.detalle})
            if(promocion.stock >= parseInt(req.body.cantidad)){
                await Promocion.updateOne({_id:promocion._id},{
                    stock: promocion.stock - parseInt(req.body.cantidad)
                })
            }
            else{
                res.render('newVenta',{
                    user: req.user,
                    venta:{},
                    producto:{},
                    promocion:{},
                    pedido:{},
                    messageFailed:'La cantidad supera el stock del producto',
                    message:''
                })
            }
        }
        // Verificar si la venta ya fue creada
        // ACTUALIZAR LA VENTA (PRODUCTO O PROMOCION)
        if(req.params.idVenta != undefined){
            let venta = await Venta.findById({_id:req.params.idVenta}).populate('productos.id').populate('promocion.id')
            if(producto){
                let total = parseInt(req.body.cantidad)*producto.precioVenta
                //Llenar producto
                await Venta.updateOne({_id:req.params.idVenta},{
                    $push:{
                        'productos':{
                            id:producto,
                            cantidad:parseInt(req.body.cantidad),
                            total: total
                        }
                    },
                    total: parseFloat(venta.total) + total
                }, (error)=>{
                    if(error)
                        console.log(error);
                })
                //Borrar el ultimo registro
                await Venta.updateOne({_id : req.params.idVenta},{
                    $pop:{
                        'productos': 1
                    }
                })
                venta = await Venta.findById({_id:req.params.idVenta}).populate('productos.id').populate('promocion.id')
                res.render('newVenta',{
                    user: req.user,
                    venta,
                    producto,
                    promocion:{},
                    pedido:{},
                    messageFailed:'',
                    message:'Venta registrada correctamente'
                })
            }else{
                let total = parseInt(req.body.cantidad)*promocion.precio
                //Llenar promocion
                await Venta.updateOne({_id:req.params.idVenta},{
                    $push:{
                        'promocion':{
                            id:promocion,
                            cantidad:parseInt(req.body.cantidad),
                            total: total
                        }
                    },
                    total: parseFloat(venta.total) + total
                }, (error)=>{
                    if(error)
                        console.log(error);
                })
                //Borrar el ultimo registro
                await Venta.updateOne({_id : req.params.idVenta},{
                    $pop:{
                        'promocion': 1
                    }
                })
                venta = await Venta.findById({_id:req.params.idVenta}).populate('productos.id').populate('promocion.id')
                res.render('newVenta',{
                    user: req.user,
                    venta,
                    producto:{},
                    promocion,
                    pedido:{},
                    messageFailed:'',
                    message:'Venta registrada correctamente'
                })
            }
        }
        // La venta no a sido creada ingreso de producto o promocion 1era vez
        // CREACION DE VENTA
        else{
            // Consultar el tamaño de las ventas para generar codigo
            let ventas = await Venta.find()
            // Crear nueva venta
            let newVenta = new Venta()
            newVenta.codigo = ventas.length+1
            newVenta.fecha = new Date().toDateString()
            newVenta.user = req.user
            // Guardar la venta
            newVenta.save(async (error)=>{
                if(error){
                    res.render('newVenta',{
                        user: req.user,
                        venta:{},
                        producto:{},
                        promocion:{},
                        pedido:{},
                        messageFailed:'Error al registrar la Venta',
                        message:''
                    })
                }
                else{
                    // Guardar el producto, actualizar venta
                    if(producto){
                        let total = parseInt(req.body.cantidad)*producto.precioVenta
                        await Venta.updateOne({_id:newVenta._id},{
                            $push:{
                                'productos':{
                                    id:producto,
                                    cantidad:parseInt(req.body.cantidad),
                                    total: total
                                }
                            },
                            total: total
                        }, (error)=>{
                            if(error){
                                console.log(error);
                            }
                        })
                        await Venta.updateOne({_id : newVenta._id},{
                            $pop:{
                                'productos': 1
                            }
                        })
                        // Consultar la venta
                        let venta = await Venta.findById({_id: newVenta._id}).populate('productos.id').populate('promocion.id')
                        res.render('newVenta',{
                            user: req.user,
                            venta,
                            producto,
                            promocion:{},
                            pedido:{},
                            messageFailed:'',
                            message:'Venta registrada correctamente'
                        })
                    }else{
                        let total = parseInt(req.body.cantidad)*promocion.precio
                        await Venta.updateOne({_id: newVenta._id},{
                            $push:{
                                'promocion':{
                                    id:promocion,
                                    cantidad:parseInt(req.body.cantidad),
                                    total: total
                                }
                            },
                            total:total
                        }, (error)=>{
                            if(error){
                                console.log(error);
                            }
                        })
                        await Venta.updateOne({_id : newVenta._id},{
                            $pop:{
                                'promocion': 1
                            }
                        })
                        let venta = await Venta.findById({_id: newVenta._id}).populate('promocion.id').populate('productos.id')
                        console.log(venta.total);
                        res.render('newVenta',{
                            user: req.user,
                            venta,
                            producto:{},
                            pedido:{},
                            promocion,
                            messageFailed:'',
                            message:'Venta registrada correctamente'
                        })
                    }
                }
            })
        }
    },
    delete: async(req, res) => {
        console.log(req.params);
        let prod = await Venta.findOne({'productos._id': req.params.idObject})
        let prom = await Venta.findOne({'promocion._id': req.params.idObject})
        let venta = await Venta.findById({_id: req.params.idVenta})
        if(prod){
            for(let i=0; i< prod.productos.length; i++){
                if(prod.productos[i]._id == req.params.idObject){
                    let producto = await Product.findById({_id:prod.productos[i].id})
                    await Product.updateOne({_id:prod.productos[i].id},{
                        stock : producto.stock + prod.productos[i].cantidad
                    }, async (error)=>{
                        if(error)
                            console.log(error);
                        else{

                            await Venta.updateOne({_id: req.params.idVenta},{
                                total: parseFloat(venta.total) - parseFloat(prod.productos[i].total),
                                $pull:{
                                    'productos':{
                                        id:prod.productos[i].id
                                    }
                                }
                            }, async(error)=>{
                                if(error)
                                    console.log(error);
                                else{
                                    venta = await Venta.findById({_id: req.params.idVenta}).populate('productos.id').populate('promocion.id')
                                    res.render('newVenta',{
                                        user: req.user,
                                        venta,
                                        producto:{},
                                        promocion:{},
                                        pedido:{},
                                        messageFailed:'',
                                        message:''
                                    })
                                }
                            })
                        }
                    })
                }
            }
        }else{
            for(let i=0; i< prom.promocion.length; i++){
                if(prom.promocion[i]._id == req.params.idObject){
                    let promo= await Promocion.findById({_id:prom.promocion[i].id})
                    await Promocion.updateOne({_id:prom.promocion[i].id},{
                        stock : promo.stock + prom.promocion[i].cantidad
                    }, async (error)=>{
                        if(error)
                            console.log(error);
                        else{
                            await Venta.updateOne({_id:req.params.idVenta},{
                                total: parseFloat(venta.total) - parseFloat(prom.promocion[i].total),
                                $pull:{
                                    'promocion':{
                                        id:prom.promocion[i].id
                                    }
                                }
                            },async(error)=>{
                                if(error)
                                    console.log(error);
                                else{
                                    venta = await Venta.findById({_id: req.params.idVenta}).populate('productos.id').populate('promocion.id')
                                    console.log(`VENTA: ${venta}`);
                                    res.render('newVenta',{
                                        user: req.user,
                                        venta,
                                        producto:{},
                                        promocion:{},
                                        pedido:{},
                                        messageFailed:'',
                                        message:''
                                    })
                                }
                            })
                        }
                    })
                    console.log(`PROMOCION: ${prom.promocion[i].cantidad}`);
                    console.log(`PROMOCION: ${prom.promocion[i].id}`);
                }
            }
        }
    },
    detail:async (req, res) => {
        let venta = await Venta.findById({_id:req.params.id}).populate('user').populate('productos.id').populate('promocion.id')
        res.render('detalleVenta',{
            user:req.user,
            venta
        })
    },
    searchVentas: async (req, res) => {
        await Venta.find({
            "$or":[
                {
                    "fecha":{
                        "$gt": new Date(req.body.search)
                    }
                }
            ]
        }).exec(async(error, ventas) =>{
            if(error){
                console.log(error);
                let ventas = await Venta.find()
                res.render('venta',{
                    user: req.user,
                    ventas,
                    message:'',
                    messageFailed:'Error en la Base de Datos'
                })
            }
            if(ventas && ventas.length <= 0){
                let ventas = await Venta.find()
                res.render('venta',{
                    user: req.user,
                    ventas,
                    message:'',
                    messageFailed:'No existen Ventas que coincidan con la búsqueda'
                })
            }else{
                res.render('venta',{
                    user: req.user,
                    ventas,
                    message:'',
                    messageFailed:''
                })
            }
        })
    },
    deleteSell: async (req, res) => {
        let venta = await Venta.findById({_id: req.params.id})
        if(parseFloat(venta.total) == 0){
            await Venta.remove({_id: req.params.id})
            let ventas = await Venta.find()
            res.render('venta', {
                user: req.user,
                ventas,
                messageFailed:'',
                message:'Venta eliminada correctamente'
            })
        }
        else{
            let ventas = await Venta.find()
            res.render('venta', {
                user: req.user,
                ventas,
                messageFailed:'La venta no se puede eliminar porque existen productos',
                message:''
            })
        }
        
    }
}

module.exports = controller