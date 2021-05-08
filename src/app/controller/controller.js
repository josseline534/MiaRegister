'use strict'
const passport = require('../../config/passport')
const User = require('../models/user')

let controller = {
    index: (req, res)=>{
        res.render('index')
    },
    login: (req, res)=>{
        res.render('login')
    },
    register: async(req, res)=>{
        if(!req.user){
            res.render('registerUsuario',{
                user: req.user
            })
        }else{
            res.render('registerUsuario', {
                user: req.user
            })
        }
    },
    users:async(req, res)=>{
        if(req.isAuthenticated()){
            const usuarios = await User.find()
            res.render('users',{
                user: req.user,
                usuarios,
                editMessage:""
            })
        }else{
            res.redirect('/')
        }
    },
    signUp:passport.authenticate('local-registro', {
        successRedirect: '/users',
        failureFlash:true,
        failureRedirect:'/formregister',
    }),
    signIn:passport.authenticate('local-login', {
        successRedirect: '/users',
        failuredFlash: true,
        failureRedirect: '/login'
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
        req.flash('deleteMessage', 'Usuario eliminado correctamente')
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
        await User.update({_id : id}, {
            name: req.body.name,
            lastname: req.body.lastName,
            password: new User().generateHash(req.body.password),
            identify: req.body.cedula,
            rol: req.body.rol,
        })
        const usuarios = await User.find()
        const editMessage = 'Usuario actualizado correctamente'
        res.render('users',{
            user: req.user,
            usuarios,
            editMessage
        })
    }
}

module.exports = controller