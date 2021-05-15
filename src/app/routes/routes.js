'use strict'

const express = require('express')
const route = express.Router()

const controller = require('../controller/controller')
const controllerProduct = require('../controller/product')
const controllerCompra = require('../controller/compra')
const { Router } = require('express')

//----------------------USER--------------------------
// GET
route.get('/', controller.index)
route.get('/login', controller.login)
route.get('/user/formregister', controller.register)
route.get('/users', controller.users)
route.get('/user/close', controller.close)
route.get('/user/logout', controller.logout)
route.get('/user/delete/:id', controller.delete)
route.get('/user/edit/:id', controller.edit)
// POST
route.post('/user/register', controller.signUp)
route.post('/users', controller.signIn)
route.post('/user/edit/:id', controller.update)

//----------------------PRODUCT--------------------------
//POST
route.post('/compras/addProducto/:id', controllerProduct.formProducto)

//----------------------COMPRA--------------------------
route.get('/compras', controllerCompra.compras)
route.get('/compras/formCompra', controllerCompra.formCompra)
route.get('/compras/deleteProducto/:idCompra&:idProducto&:cant&:id', controllerCompra.delete)
route.get('/compras/editProducto/:idCompra&:idProducto&:cant&:id', controllerCompra.edit)
route.get('/compras/detalles/:id', controllerCompra.detail)
//POST
route.post('/compras/formCompra', controllerCompra.insert)
route.post('/compras/editProducto/:idCompra&:idProd&:idObjProd&:cant', controllerCompra.update)
module.exports = route