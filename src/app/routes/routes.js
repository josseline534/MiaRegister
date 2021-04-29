'use strict'

const express = require('express')
const route = express.Router()

const controller = require('../controller/controller')

// GET
route.get('/', controller.index)
route.get('/login', controller.login)
route.get('/register', controller.register)
route.get('/users', controller.users)
route.get('/close', controller.close)
route.get('/logout', controller.logout)
route.get('/delete/:id', controller.delete)
route.get('/edit/:id', controller.edit)
// POST
route.post('/register', controller.signUp, controller.signUpUser)
route.post('/users', controller.signIn)
route.post('/edit/:id', controller.update)

module.exports = route