'use strict'

const express = require('express')
const route = express.Router()

const controller = require('../controller/controller')
const controllerProduct = require('../controller/product')
const controllerCompra = require('../controller/compra')
const controllerPromociones = require('../controller/promociones')
const controllerVenta = require('../controller/venta')
const controllerEstadisticas = require('../controller/estadisticas')

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
//GET
route.get('/productos', controllerProduct.productos)
route.get('/productos/delete/:id', controllerProduct.delete)
route.get('/productos/editar/:id', controllerProduct.edit)
//POST
route.post('/compras/addProducto/:id', controllerProduct.formProducto)
route.post('/productos/search', controllerProduct.search)
route.post('/productos/editar/:id',controllerProduct.update)

//----------------------COMPRA--------------------------
//GET
route.get('/compras', controllerCompra.compras)
route.get('/compras/formCompra', controllerCompra.formCompra)
route.get('/compras/deleteProducto/:idCompra&:idProducto&:cant&:id', controllerCompra.delete)
route.get('/compras/editProducto/:idCompra&:idProducto&:cant&:id', controllerCompra.edit)
route.get('/compras/detalles/:id', controllerCompra.detail)
//POST
route.post('/compras/formCompra', controllerCompra.insert)
route.post('/compras/editProducto/:idCompra&:idProd&:idObjProd&:cant', controllerCompra.update)
route.post('/compras/search', controllerCompra.search)

//----------------------PROMOCIONES--------------------------
//GET
route.get('/promociones', controllerPromociones.promociones)
route.get('/promociones/add', controllerPromociones.formInsert)
route.get('/promociones/delete/:idPromocion&:detalle&:idObject', controllerPromociones.delete)
route.get('/promociones/deleteProd/:id', controllerPromociones.deletePromocion)
route.get('/promociones/llenarproducto/:id&:idPromo', controllerPromociones.llenar)
route.get('/promociones/editar/:id', controllerPromociones.edit)
//POST
route.post('/promociones/add', controllerPromociones.insert)
route.post('/promociones/search/:id', controllerPromociones.search)
route.post('/promociones/searchPromocion/', controllerPromociones.searchPromocion)
route.post('/promociones/addProducto/:id', controllerPromociones.insertProd)
route.post('/promociones/update/:id', controllerPromociones.update)

//----------------------VENTA--------------------------
//GET
route.get('/ventas', controllerVenta.venta)
route.get('/venta/formVentas', controllerVenta.formVenta)
route.get('/venta/llenarPromocion/:idpromocion&:idventa?', controllerVenta.llenarProm)
route.get('/venta/llenarProducto/:idproducto&:idventa?', controllerVenta.llenarProd)
route.get('/ventas/delete/producto/:idVenta&:idObject', controllerVenta.delete)
route.get('/ventas/detalle/:id', controllerVenta.detail)
route.get('/ventas/delete/:id', controllerVenta.deleteSell)
//POST
route.post('/ventas/search/:id?', controllerVenta.search)
route.post('/venta/producto/:idVenta?', controllerVenta.add)
route.post('/ventas/searchVentas', controllerVenta.searchVentas)

//----------------------ESTADISTICAS--------------------------
//GET
route.get('/estadisticas', controllerEstadisticas.estadisticas)
route.get('/estadisticas/menorStock', controllerEstadisticas.menorStock)
//POST
route.post('/estadisticas/menorStock', controllerEstadisticas.menor)
module.exports = route