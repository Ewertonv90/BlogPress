const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')
 
passwrong ="" 
router.get(`/admin/users/create/`, (req,res)=>{
    
    res.render("admin/users/create")
   
})

// salva um usuário
router.post("/users/create", (req,res)=>{

   
    var nome = req.body.name
    var sobrenome = req.body.lastname
    var email = req.body.email
    var senha = req.body.password

    ///encriptação comn Hash na senha
    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(senha, salt)

    if(req.body.password == req.body.repeatpass){

    User.create({
        name : nome,
        lastname: sobrenome,
        email: email,
        password: hash
    }).then(() =>{
          
       
        res.redirect(`/admin/users/index`)
        
        
    })
}
   else{
      
      
       res.redirect(`/admin/users/create?create=${passwrong.failed}`)
      
   }
})

router.get( '/admin/users/index', (req, res) =>{

    User.findAll().then( user=>{
        res.render("admin/users/index", { user:user})
    })

    
})

module.exports = router