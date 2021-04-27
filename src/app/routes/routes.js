'use strict'

const express = require('express')
const route = express.Router()

const controller = require('../controller/controller')

// GET
route.get('/', controller.index)
route.get('/login', controller.login)

module.exports = route