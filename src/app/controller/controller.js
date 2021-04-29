'use strict'
const passport = require('../../config/passport')
const User = require('../../app/models/user')

let controller = {
    index: (req, res)=>{
        res.render('index')
    },
    login: (req, res)=>{
        res.render('login')
    },
    register: (req, res)=>{
        res.render('registerUsuario', {
            user: req.user
        })
    },
    users:async(req, res)=>{
        if(req.isAuthenticated()){
            const usuarios = await User.find()
            res.render('users',{
                user: req.user,
                usuarios
            })
        }else{
            res.redirect('/')
        }
    },
    signUp:passport.authenticate('local-registro', {
        failuredRedirect: '/registerUsuario',
        failuredFlash: true
    }),
    signUpUser: async (req, res) => {
        const usuarios = await User.find()
        let user = await User.findById({_id: req.body.userLog})
        res.render('users',{
            user: user,
            usuarios
        })
    },
    signIn:passport.authenticate('local-login', {
        successRedirect: '/users',
        failuredRedirect: '/login',
        failuredFlash: true
    }),
    close: (req, res) => {
        res.render('salirUsuario', {
            user: req.user
        })
    },
    logout: (req, res)=>{
        req.logout()
        res.redirect('/')
    },
    delete: async (req, res) => {
        const { id } = req.params
        await User.remove({_id: id})
        res.redirect('/users')
    },
    edit: async (req, res)=>{
        const { id } = req.params
        let usuario = await User.findById({_id: id})
        res.render('editUser',{
            user : req.user,
            usuario
        })
    },
    update: async (req, res) => {
        const { id } = req.params
        await User.update({_id : id}, req.body)
        const usuarios = await User.find()
        res.render('users',{
            user: req.user,
            usuarios
        })
    }
}

module.exports = controller