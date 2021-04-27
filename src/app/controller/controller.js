'use strict'

let controller = {
    index: (req, res)=>{
        res.render('index')
    },
    login: (req, res)=>{
        res.render('login')
    },
}

module.exports = controller