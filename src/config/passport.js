const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../app/models/user')

passport.serializeUser((user, done) =>{
    done(null, user.id)
})

passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user) =>{
        done(err, user)
    })
})

// registro
passport.use('local-registro', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'password',
    passReqToCallback: true
},async(req, usuario, password, done) => {
    await User.findOne({'user': usuario}, (error, user) => {
        if (error){
            return done(error)
        }
        if (user){
            return done(null, false, req.flash('RegistroMessage', 'Usuario ya existe'))
        }else{
            let newUser = new User()
            newUser.name = req.body.name
            newUser.lastname = req.body.lastName
            newUser.identify = req.body.cedula
            newUser.user = usuario
            newUser.password = newUser.generateHash(password)
            newUser.rol = req.body.rol
            newUser.save((error) => {
                if (error){
                    console.log(error);
                }else{
                    return done(null, newUser)
                }
            })
        }
    })
}))

// ingreso

passport.use('local-login', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, usuario, password, done) => {
    await User.findOne({'user': usuario}, (err, user) => {
        console.log(user);
        if (err){
            return done(err)
        }
        if (!user){
            return done(null, false, req.flash('LoginMessage', 'Usuario no registrado'))
        }else{
            if(!user.validatePassword(password, user.password)){
                return done(null, false, req.flash('LoginMessage', 'Contraseña incorrecta'))
            }else{
                return done(null, user)
            }
        }
    })
}))

module.exports = passport