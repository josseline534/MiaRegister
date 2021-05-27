'use strict'

const Product = require('../models/producto')
const Promocion = require('../models/promocion')

let controller ={
    promociones: async(req, res)=>{
        if(req.isAuthenticated()){
            let promociones = await Promocion.find().populate('productos.id')
            res.render('promociones',{
                user: req.user,
                promociones,
                message:'',
                messageFailed:''
            })
        }else
            res.redirect('/')
    },
    formInsert: (req, res)=>{
        res.render('newPromocion',{
            user: req.user,
            message:'',
            messageFailed:''
        })
    },
    insert: (req, res) => {
        let params = req.body
        if(params.codigo && params.detalle && params.stock && params.precio){
            let promocion = new Promocion ()
            promocion.codigo = params.codigo
            promocion.detalle = params.detalle
            promocion.stock = parseInt(params.stock)
            promocion.precio = params.precio
            promocion.save(async(error)=>{
                if(error){
                    console.log(`ERROR ${error}`);
                    res.render('newPromocion',{
                        user: req.user,
                        message:'',
                        messageFailed:'No se pudo guardar la promoción'
                    })
                }else{
                    let promocion = await Promocion.findOne({codigo:params.codigo})
                    res.render('addProdPromo',{
                        user: req.user,
                        promocion,
                        productos:[],
                        message:'Promoción guardada correctamente',
                        messageFailed:''
                    })
                }
            })
        }else{
            res.render('newPromocion',{
                user: req.user,
                message:'',
                messageFailed:'Verifique que todos los campos se encuentren llenos'
            })
        }
    },
    search: async(req, res) => {
        let promocion = await Promocion.findById({_id:req.params.id}).populate('productos.id')
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
                res.render('addProdPromo',{
                    user: req.user,
                    productos:{},
                    promocion,
                    messageFailed:'Error al conectarse con la Base de Datos',
                    message:''
                })
            }
            if(!productos || productos.length<=0){
                res.render('addProdPromo',{
                    user: req.user,
                    productos:{},
                    promocion,
                    messageFailed:'No existen productos que coincidan con la búsqueda',
                    message:''
                })
            }else{
                res.render('addProdPromo',{
                    user: req.user,
                    promocion,
                    productos,
                    messageFailed:'',
                    message:''
                })
            }
        })
    },
    insertProd: async(req, res)=>{
        let promocion = await Promocion.findById({_id: req.params.id})
        let stockTotal = parseInt(promocion.stock) * req.body.cantidad
        let prod = await Product.findOne({detalle: req.body.detalle})
        let prodIngresado = await Promocion.find(
            {_id:req.params.id,"productos.id": prod._id},
            {"_id": false, "productos.$": true})
        if(prodIngresado != "" ){
            res.render('addProdPromo',{
                user: req.user,
                productos:{},
                promocion,
                messageFailed:`El producto ${req.body.detalle} ya esta ingresado`,
                message:''
            })
        }else{
            await Product.findOne({detalle: req.body.detalle},
                async(error, producto) => {
                    if(error){
                        console.log(`ERROR ${error}`);
                        res.render('addProdPromo',{
                            user: req.user,
                            productos:{},
                            promocion,
                            messageFailed:'Error al conectarse con la Base de Datos',
                            message:''
                        })
                    }
                    if(!producto){
                        res.render('addProdPromo',{
                            user: req.user,
                            productos:{},
                            promocion,
                            messageFailed:'No se encontro el producto',
                            message:''
                        })
                    }
                    if(producto){
                        if(parseInt(producto.stock) >= stockTotal){
                            await Product.updateOne({_id: producto._id},{
                                stock: parseInt(producto.stock)-stockTotal
                            },async(error) => {
                                if(error){
                                    console.log(`ERROR ${error}`);
                                    res.render('addProdPromo',{
                                        user: req.user,
                                        productos:{},
                                        promocion,
                                        messageFailed:'Error al conectarse con la Base de Datos',
                                        message:''
                                    })
                                }else{
                                    await Promocion.updateOne({_id:req.params.id},{
                                        $push:{
                                            'productos':{id:producto,cantidad:parseInt(req.body.cantidad)}
                                        }
                                    },async(error)=>{
                                        if(error){
                                            console.log(`ERROR ${error}`);
                                            res.render('addProdPromo',{
                                                user: req.user,
                                                productos:{},
                                                promocion,
                                                messageFailed:'Error al conectarse con la Base de Datos',
                                                message:''
                                            })
                                        }else{
                                            await Promocion.updateOne({_id : req.params.id},{
                                                $pop:{
                                                    'productos': 1
                                                }
                                            })
                                            let promocion = await Promocion.findById({_id:req.params.id}).populate('productos.id')
                                            console.log(promocion);
                                            res.render('addProdPromo',{
                                                user: req.user,
                                                productos:{},
                                                promocion,
                                                messageFailed:'',
                                                message:'Producto añadido correctamente'
                                            })
                                        }
                                    })
                                }
                            })
                        }else{
                            res.render('addProdPromo',{
                                user: req.user,
                                productos:{},
                                promocion,
                                messageFailed:'',
                                message:'El stock no es suficiente para crear la promoción'
                            })
                        }
                    }
            })
        }
    },
    delete: async(req, res)=>{
        console.log(req.params);
        let product = await Product.findOne({detalle: req.params.detalle})
        let promocion = await Promocion.findOne({"productos._id": req.params.idObject})
        await Product.updateOne({_id:product._id},{
            stock : parseInt(product.stock) + (parseInt(promocion.productos[0].cantidad)*promocion.stock)
        },async(error) => {
            if(error){
                console.log(`ERROR ${error}`);
                let promocion = await Promocion.findById({_id: req.params.idPromocion})
                res.render('addProdPromo',{
                    user: req.user,
                    productos:{},
                    promocion,
                    messageFailed:'Error al conectarse con la Base de Datos',
                    message:''
                })
            }else{
                await Promocion.updateOne({_id: req.params.idPromocion},{
                    $pull:{
                        'productos':{
                            _id:req.params.idObject
                        }
                    }
                },async(error) => {
                    let promocion = await Promocion.findById({_id: req.params.idPromocion})
                    if(error){
                        console.log(`ERROR ${error}`);
                        res.render('addProdPromo',{
                            user: req.user,
                            productos:{},
                            promocion,
                            messageFailed:'Error al eliminar el producto de la promoción',
                            message:''
                        })
                    }else{
                        res.render('addProdPromo',{
                            user: req.user,
                            productos:{},
                            promocion,
                            messageFailed:'',
                            message:'Producto eliminado de la promoción'
                        })
                    }
                })
            }
        })
    },
    deletePromocion: async(req, res) => {
        await Promocion.findById({_id: req.params.id}, async(error, promocion) =>{
            if(error){
                let promociones = await Promocion.find()
                res.render('promociones',{
                    user: req.user,
                    promociones,
                    message:'',
                    messageFailed:'Error en la Base de Datos'
                })
            }else{
                for(let i=0; i<promocion.productos.length; i++){
                    let prod = await Product.findById({_id: promocion.productos[i].id})
                    await Product.updateOne({_id:promocion.productos[i].id},{
                        stock:parseInt(prod.stock) + (parseInt(promocion.productos[i].cantidad)*promocion.stock)
                    },async(error)=>{
                        if(error){
                            let promociones = await Promocion.find()
                            res.render('promociones',{
                                user: req.user,
                                promociones,
                                message:'',
                                messageFailed:'Error en la Base de Datos'
                            })
                        }
                    })
                }
                await Promocion.findByIdAndDelete({_id:promocion._id},async(error)=>{
                    let promociones = await Promocion.find()
                    if(error){
                        res.render('promociones',{
                            user: req.user,
                            promociones,
                            message:'',
                            messageFailed:'Error en la Base de Datos'
                        })
                    }else{
                        res.render('promociones',{
                            user: req.user,
                            promociones,
                            message:'Promoción eliminada correctamente',
                            messageFailed:''
                        })
                    }
                })
            }
        })
    },
    searchPromocion:async(req, res)=>{
        await Promocion.find({
            "$or":[
                {
                    "detalle":{
                        "$regex":req.body.search,
                        "$options": "i"
                    }
                },
            ]
        }).populate('productos.id').exec(async(error,promociones)=>{
            if(error){
                let promociones = await Promocion.find().populate('productos.id')
                res.render('promociones',{
                    user: req.user,
                    promociones,
                    message:'',
                    messageFailed:'Error en la Base de Datos'
                })
            }
            if(promociones.length <= 0){
                let promociones = await Promocion.find().populate('productos.id')
                res.render('promociones',{
                    user: req.user,
                    promociones,
                    message:'',
                    messageFailed:'No existen Promociones que coincidan con la búsqueda'
                })
            }else{
                res.render('promociones',{
                    user: req.user,
                    promociones,
                    message:'',
                    messageFailed:''
                })
            }
        })
    }
}

module.exports = controller