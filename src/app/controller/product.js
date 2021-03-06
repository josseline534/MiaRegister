'use strict'

let validator = require('validator')

const Product = require('../models/producto')
const Compra = require('../models/compra')

let controller = {
    formProducto: async(req, res)=>{

        const { id } = req.params
        let newCompra = await Compra.findById({_id: id})

        //Calculo de IVA y Precio de Venta
        let pUnit = parseFloat((req.body.pUnit))
        let iva = pUnit * 0.12
        let pVenta = ((pUnit + iva)* 0.5)+(pUnit + iva)

        let prodIngresado = await Compra.find(
            {_id:newCompra._id,"productos.producto.detalle": req.body.detail},
            {"_id": false, "productos.$": true})
        if(prodIngresado != "" ){
            res.render('newProducto', {
                user: req.user,
                newCompra,
                message: `El producto ${req.body.detail} ya fue ingresado`,
            })
        }else{
            await Product.findOne({
                'detalle':req.body.detail
            }, async(error, producto)=>{
                if(error){
                    console.log(`ERROR PRODUCTO: ${error}`);
                }
                if(producto){
                    //Actualizar stock, precios
                    await Product.updateOne({_id:producto._id},{
                        detalle: req.body.detail,
                        stock: parseInt(producto.stock) + parseInt(req.body.cantidad),
                        precioUnit: pUnit,
                        ganancia:50,
                        iva: iva,
                        precioVenta: pVenta
                    }, async(error)=>{
                        if(error){
                            console.log(`ERROR PRODUCTO SAVE: ${error}`);
                            res.render('newProducto', {
                                user: req.user,
                                newCompra,
                                message: 'No se pudo guardar el producto',
                            })
                        }else{
                            //Actualizar Compra y añadir el producto
                            let pTotal = req.body.cantidad * pUnit
                            await Compra.updateOne({_id : id},{
                                $push:{
                                    'productos':{
                                        producto :{
                                            id: producto,
                                            detalle: producto.detalle,
                                            cantidad: req.body.cantidad,
                                            precioTotal: pTotal
                                        }
                                    }
                                }
                            },async(error)=>{
                                if(error){
                                    console.log(`ERROR PRODUCTO SAVE COMPRA: ${error}`);
                                    res.render('newProducto', {
                                        user: req.user,
                                        newCompra,
                                        message: 'No se pudo registrar el producto en la factura',
                                    })
                                }else{
                                    await Compra.updateOne({_id : id},{
                                        $pop:{
                                            'productos': 1
                                        }
                                    })
                                    newCompra = await Compra.findById({_id: id})
                                    res.render('newProducto', {
                                        user: req.user,
                                        newCompra,
                                        message: 'Producto registrado correctamente',
                                    })
                                }
                            })
                        }
                    })
                }else{
                    //Validacion Producto nuevo
                    try{
                        var detalle = !validator.isEmpty(req.body.detail)
                    }catch(error){
                        console.log(`ERROR CATCH PRODUCTO: ${error}`);
                        res.render('newProducto', {
                            user: req.user,
                            newCompra,
                            message: 'Los datos son incorrectos'
                        })
                    }
                    //Insertar Producto nuevo
                    if(detalle){
                        //LLenar BD
                        let newProducto = new Product()
                        newProducto.detalle = req.body.detail
                        newProducto.stock = req.body.cantidad
                        newProducto.precioUnit = req.body.pUnit
                        newProducto.ganancia = 50
                        newProducto.iva = iva.toString()
                        newProducto.precioVenta = pVenta.toString()
                        //Guardar
                        newProducto.save(async(error)=>{
                            if(error){
                                console.log(`ERROR PRODUCTO SAVE: ${error}`);
                                res.render('newProducto', {
                                    user: req.user,
                                    newCompra,
                                    message: 'No se pudo guardar el producto',

                                })
                            }else{
                                //Actualizar Compra y añadir el producto
                                let pTotal = req.body.cantidad * newProducto.precioUnit
                                await Compra.updateOne({_id : id},{
                                    $push:{
                                        'productos':{
                                            producto :{
                                                id: newProducto,
                                                detalle: newProducto.detalle,
                                                cantidad: req.body.cantidad,
                                                precioTotal: pTotal
                                            }
                                        }
                                    }
                                },async(error)=>{
                                    if(error){
                                        console.log(`ERROR PRODUCTO SAVE COMPRA: ${error}`);
                                        res.render('newProducto', {
                                            user: req.user,
                                            newCompra,
                                            message: 'No se pudo registrar el producto en la factura',
                                        })
                                    }else{
                                        await Compra.updateOne({_id : id},{
                                            $pop:{
                                                'productos': 1
                                            }
                                        })
                                        newCompra = await Compra.findById({_id: id})
                                        res.render('newProducto', {
                                            user: req.user,
                                            newCompra,
                                            message: 'Producto registrado correctamente',
                                        })
                                    }
                                })
                            }
                        })
                    }else{
                        res.render('newProducto', {
                            user: req.user,
                            newCompra,
                            message: 'Los datos son incorrectos'
                        })
                    }
                }
            })
        }
    },
    productos: async (req, res)=>{
        if(req.isAuthenticated()){
            await Product.find((error, productos)=>{
                if(error){
                    res.render('productos',{
                        user: req.user,
                        productos:[],
                        messageFailed:'Error al conectarse con la Base de Datos',
                        message:''
                    })
                }
                if(!productos || productos.length <=0){
                    res.render('productos',{
                        user: req.user,
                        productos:[],
                        messageFailed:'',
                        message:'No existen productos para mostrar'
                    })
                }else{
                    res.render('productos',{
                        user: req.user,
                        productos,
                        messageFailed:'',
                        message:''
                    })
                }
            })
        }else
            res.redirect('/')
    },
    delete: async(req, res)=>{
        await Product.findByIdAndDelete({_id: req.params.id}, async (error)=>{
            let productos = await Product.find()
            if(error){
                res.render('productos',{
                    user: req.user,
                    productos,
                    messageFailed:'No se pudo eliminar el producto',
                    message:''
                })
            }else{
                res.render('productos',{
                    user: req.user,
                    productos,
                    messageFailed:'',
                    message:'Producto eliminado'
                })
            }
        })
    },
    search: async(req, res)=>{
        await Product.find({
            "$or":[
                {
                    "detalle":{
                        "$regex":req.body.search,
                        "$options": "i"
                    }
                },
            ]
        }).exec(async (error, productos)=>{
            if(error){
                const productos = await Product.find()
                res.render('productos',{
                    user: req.user,
                    productos,
                    messageFailed:'Error al conectarse con la Base de Datos',
                    message:''
                })
            }
            if(!productos || productos.length <=0){
                const productos = await Product.find()
                res.render('productos',{
                    user: req.user,
                    productos,
                    messageFailed:'',
                    message:'No existen productos que coincidan con la búsqueda'
                })
            }else{
                res.render('productos',{
                    user: req.user,
                    productos,
                    messageFailed:'',
                    message:''
                })
            }
        })
    },
    edit: async(req, res)=>{
        await Product.findById({_id: req.params.id}, (error, producto)=>{
            if(error){
                res.render('productos',{
                    user: req.user,
                    productos,
                    messageFailed:'Error al conectarse con la Base de Datos',
                    message:''
                })
            }
            if(producto){
                res.render('editProducto',{
                    user: req.user,
                    producto,
                    message:'',
                    messageFailed:''
                })
            }
        })
    },
    update: async(req, res)=>{
        let pUnit = parseFloat(req.body.pUnit)
        let ganancia = parseInt(req.body.ganancia)
        let iva = pUnit * 0.12
        let total = pUnit + iva
        let pVenta = (total * (ganancia/100)) + total
        await Product.updateOne({_id: req.params.id},{
            detalle: req.body.detail,
            stock: parseInt(req.body.stock),
            precioUnit: pUnit,
            iva,
            ganancia,
            precioVenta:pVenta

        })
        let productos = await Product.find()
        res.render('productos',{
            user: req.user,
            productos,
            messageFailed:'',
            message:`Producto ${req.body.detail} actualizado correctamente`
        })
    }
}
module.exports = controller