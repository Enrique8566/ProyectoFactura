const { query, json, urlencoded } = require('express');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const session = require('express-session');
const { Cookie } = require('express-session');
const bcrypt = require('bcrypt');

    

const conection = require('../../database/database.js');


router.get('/login', (req, res) => {
          req.session.usuario = null
          res.render('./login/login', {
                    layout: false
          })
})

router.post('/login', async(req, res) => {

          let login = {
                    correo: req.body.correo,
                    contra:req.body.contra
          }
          if(req.body.correo!=""){
                    if (/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(req.body.correo)){
                              conection.query(`SELECT id,correo,contrasenia FROM usuarios WHERE correo="${login.correo}"`,(err,result)=>{
                                        const user = Object.values(JSON.parse(JSON.stringify(result)));
                                        console.log(user)

                                        if (user!="") {
                                                  if (bcrypt.compare(login.contra,user[0].contrasenia)){
                                                            console.log("contraseña correcta")
                                                            req.session.usuario=user[0].id
                                                            console.log(req.session.usuario)
                                                            res.redirect('/router/guardarFactura')
                                                  }else{
                                                            console.log("contraseña incorrecta")
                                                            res.redirect('back') 
                                                  }
                                                  //console.log(user[0].contraseña)
                                                  //res.redirect('back')   
                                        }else{
                                                  console.log("sin registro")
                                                  res.redirect('back')
                                        }
                                        
                              })
                    }else{
                              res.redirect('back')
                    } 
          }

         /*
          let pass2='$2b$08$sOnhXT41qZ5Qk7Y/HX/IHuuuocSWLzOxG7aEPD6Dlf7Gqbsujb.9u';       
          if(await bcrypt.compare(login.contra,pass2)){
                    console.log("iguales")
          }else{
                    console.log("no son iguales")
          }
          //console.log(login)
          //console.log(pass)
          */
          
})
/*
if (req.body.correo != "") {
                    if (/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(req.body.correo)) {
                              conection.query(`SELECT id,correo,contraseña FROM usuarios WHERE correo="${login.correo}" AND contraseña="${login.contra}";`, (err, result) => {
                                        const user = Object.values(JSON.parse(JSON.stringify(result)));
                                        //let passwordHash=bcrypt.hashSync(login.contra,8)

                                        //console.log(passwordHash)
                                        if (err) throw err;
                                        //console.log(user)
                                        if (result.length > 0) {
                                                  const usuario = user
                                                  conection.query(`SELECT id FROM usuarios WHERE correo="${login.correo}" AND contraseña="${login.contra}";`, (err, result) => {
                                                            const idU = Object.values(JSON.parse(JSON.stringify(result)));

                                                            if (err) throw err;
                                                            const idUser = idU
                                                            req.session.usuario = idUser
                                                            //console.log(req.session.usuario)
                                                            res.redirect('/router/guardarFactura')
                                                  })
                                        } else {
                                                  //console.log(user)
                                                  res.redirect('back')
                                        }

                              })
                    } else {
                              res.redirect('back')
                    }
          }
*/


module.exports = router;




