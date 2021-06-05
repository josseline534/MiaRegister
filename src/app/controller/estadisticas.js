'use strict'

const Producto = require('../models/producto')

let controller = {
    estadisticas: (req, res)=>{
        if(req.isAuthenticated()){
            res.render('estadisticas',{
                user: req.user,
                prodMenor:{}
            })
        }else{
            res.redirect('/')
        }
    },
    menorStock: async (req, res) =>{
        if(req.isAuthenticated()){
            await Producto.find({
                "$or":[
                    {
                        "stock":{
                            "$lt": 3
                        }
                    }
                ]
            }).exec((error, prodMenor) => {
                if(error)
                    console.log(error);
                if(prodMenor){
                    res.render('menorStock',{
                        user: req.user,
                        prodMenor
                    })
                }
            })
        }else{
            res.redirect('/')
        }
    },
    menor: async(req, res) => {
        if(req.isAuthenticated()){
            await Producto.find({
                "$or":[
                    {
                        "stock":{
                            "$lt":parseInt(req.body.stock),
                        }
                    },
                ]
            }).exec((error, prodMenor) => {
                if(error)
                    console.log(error);
                if(prodMenor){
                    res.render('menorStock',{
                        user: req.user,
                        prodMenor
                    })
                }
            })
        }else{
            res.redirect('/')
        }
    }
}

module.exports = controller