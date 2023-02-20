const { query, json } = require('express');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const session = require('express-session');
const { Cookie } = require('express-session');

const conection = require('../../database/database.js');

router.get('/datos', (req, res) => {
          if (req.session.usuario != null) {
                    conection.query(`SELECT * FROM proveedores`, (err, result) => {
                              const mostrar = Object.values(JSON.parse(JSON.stringify(result)));

                              //console.log(mostrar)
                              res.render('./Proveedores/datosProv', {
                                        mostrar: mostrar
                              })
                    })
          } else {
                    console.log('no ingresado')
                    res.redirect('/login/login?')
          }


})

router.get('/nuevoProveedor', (req, res) => {

          if (req.session.usuario != null) {
                    let datos = {
                              estado: 0,
                              rut: "",
                              rutV: "",
                              razonSocial: "",
                              alias: "",
                              giro: "",
                              direccion: "",
                              ciudad: "",
                              fono: "",
                              correo: "",
                              correoV: ""
                    }
                    //console.log("datos get")
                    //console.log(datos)
                    if (req.session.datosC != null) {
                              datos = req.session.datosC
                              console.log("datos if\n")
                              console.log(datos)
                              console.log('sados cookie')
                              console.log(req.session.datosC)
                              req.session.datosC = null
                    }
                    req.session.datosC = null
                    //console.log(datos)
                   

                    

                    res.render('./Proveedores/nuevoPorveedor', {
                              datos: datos,
                              hola: hola
                    })
          } else {
                    console.log('no ingresado')
                    res.redirect('/login/login?')
          }




})

router.post('/nuevoProveedor', (req, res) => {

          const fecha = new Date()
          const fechaMax = [fecha.getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date().getDate())).slice(-2) + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()];
          let datosP = {
                    rut: req.body.rut,
                    razonSocial: req.body.razonSocial,
                    alias: req.body.alias,
                    giro: req.body.giro,
                    direccion: req.body.direccion,
                    ciudad: req.body.ciudad,
                    fono: req.body.telefono,
                    correo: req.body.correo
          }
          if (datosP.direccion == "") {
                    datosP.direccion = "N/A"
          }
          if (datosP.ciudad == "") {
                    datosP.ciudad = "N/A"
          }
          if (datosP.fono == "") {
                    datosP.fono = "N/A"
          }
          if (datosP.correo == "") {
                    datosP.correo = "N/A"
          }
          //console.log(datosP)

          req.session.datosC = {
                    estado: 0,
                    rut: req.body.rut,
                    rutV: "",
                    razonSocial: req.body.razonSocial,
                    alias: req.body.alias,
                    giro: req.body.giro,
                    direccion: req.body.direccion,
                    ciudad: req.body.ciudad,
                    fono: req.body.telefono,
                    correo: req.body.correo,
                    correoV: ""
          }
          let rut = req.body.rut
          //rescata el ultimo diigito
          let dig = rut.substring(rut.length - 1);
          //rut=rut.replaceAll(".","").replaceAll("-","").replaceAll(dig,"").split("").reverse()
          //rescata el rut sin digito ni simbolos
          rut = rut.substring(0, rut.length - 1).replace(/\D/g, '');
          //separa e invierte la cadena
          numeros = rut.split('').reverse()

          //console.log(rut)
          //console.log(numeros)
          //console.log('digito: ', dig.toLowerCase())

          let caja = 0;
          let multiplo = 2;

          for (let n of numeros) {
                    caja += parseInt(n) * multiplo

                    multiplo++;

                    if (multiplo == 8) {
                              multiplo = 2;
                    }
          }
          let dv = 11 - (caja % 11);

          if (dv == 11) {
                    dv = '0'
          }
          if (dv == 10) {
                    dv = 'k'
          }
          console.log(dv)


          if (dv == dig.toLowerCase()) {
                    console.log('rut valido')
                    req.session.estado = 0
          } else {
                    console.log('rut invalido')
                    req.session.datosC.estado = 1
                    req.session.datosC.rutV = "rut invalido"
          }
          let rutValidado = rut.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + "-" + dv;
          console.log(rutValidado)

          if (req.body.correo != "") {
                    if (/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(req.body.correo)) {
                              req.session.estado = 0
                    } else {
                              req.session.datosC.estado = 1
                              req.session.datosC.correoV = "Correo invalido"
                              console.log('correo invalido')
                    }
          }


          if (req.session.datosC.estado == 0) {
                    conection.query(`INSERT INTO proveedores SET rut="${rutValidado}",razonSocial="${datosP.razonSocial.toUpperCase()}",alias="${datosP.alias.toUpperCase()}",giro="${datosP.giro.toUpperCase()}",direccion="${datosP.direccion.toUpperCase()}",ciudad="${datosP.ciudad.toUpperCase()}",telefono="${datosP.fono.toUpperCase()}",correo="${datosP.correo.toUpperCase()}",user_id="8566",created_at="${fechaMax}",updated_at="${fechaMax}"`,
                              (err, result) => {
                                        if (err) throw err;

                                        res.redirect('/proveedor/datos')
                              })
          } else {
                    //console.log(req.session.datosC)
                    res.redirect('back')

          }
})


router.get('/editar/:id', (req, res) => {
          if (req.session.usuario != null) {
                    let id = req.params.id
                    conection.query(`SELECT id FROM facturas WHERE proveedor_id="${id}"`, (err, result) => {
                              const consulta = Object.values(JSON.parse(JSON.stringify(result)));
                              const ids = consulta.length;
                              //console.log(consulta)
                              console.log(ids)
                              conection.query(`SELECT * FROM proveedores WHERE id ="${id}"`, (err, result) => {
                                        const dato = Object.values(JSON.parse(JSON.stringify(result)));
                                        res.render('./Proveedores/actuProv', {
                                                  id: id,
                                                  dato: dato[0],
                                                  ids: ids
                                        })
                              })
                    })
          } else {
                    console.log('no ingresado')
                    res.redirect('/login/login?')
          }


})

router.get('/eliminar/:id', (req, res) => {
          let id = req.params.id

          //console.log(id)
          conection.query(`SELECT id FROM facturas WHERE proveedor_id="${id}"`, (err, result) => {
                    const consulta = Object.values(JSON.parse(JSON.stringify(result)));
                    const ids = consulta.length;
                    //console.log(ids)
                    if (ids==0) {
                              conection.query(`DELETE FROM proveedores WHERE id="${id}"`,
                              (err, resultado) => {
                                        if (err) {
                                                  console.log(err),
                                                            res.redirect('back')
                                                  return;
                                        } else (
                                                  console.log('datos borrados'),
                                                  console.log("provvedor sin facturas adjuntas"),
                                                  res.redirect('/proveedor/datos')
                                        )
                              })   
                    }else{
                              res.redirect('back')
                    }
                              
                   
          })
         
})

router.post('/editar', (req, res) => {

          const fecha = new Date()
          const fechaMax = [fecha.getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date().getDate())).slice(-2) + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()];

          let datos = {
                    id: req.body.id,
                    rut: req.body.rut,
                    razonSocial: req.body.razonSocial,
                    alias: req.body.alias,
                    giro: req.body.giro,
                    direccion: req.body.direccion,//*
                    ciudad: req.body.ciudad,//*
                    fono: req.body.fono,//*
                    correo: req.body.correo//*
          }
          let consulta = `UPDATE proveedores SET rut="${datos.rut}",razonSocial="${datos.razonSocial.toUpperCase()}",alias="${datos.alias.toUpperCase()}",giro="${datos.giro.toUpperCase()}",updated_at="${fechaMax}"`

          if (datos.direccion != "") {
                    consulta += `,direccion="${datos.direccion.toUpperCase()}"`
          } else {
                    datos.direccion = "N/A"
                    consulta += `,direccion="${datos.direccion.toUpperCase()}"`
          }

          if (datos.ciudad != "") {
                    consulta += `,ciudad="${datos.ciudad.toUpperCase()}"`
          } else {
                    datos.ciudad = "N/A"
                    consulta += `,ciudad="${datos.ciudad.toUpperCase()}"`
          }
          if (datos.fono != "") {
                    consulta += `,telefono="${datos.fono}"`
          } else {
                    datos.fono = "N/A"
                    consulta += `,telefono="${datos.fono}"`
          }
          if (datos.correo != "") {
                    consulta += `,correo="${datos.correo.toUpperCase()}"`
          } else {
                    datos.correo = "N/A"
                    consulta += `,correo="${datos.correo.toUpperCase()}"`
          }
          conection.query(consulta + `WHERE id="${datos.id}"`, (err, result) => {
                    res.redirect('back')
          })
          //console.log('a')
          //console.log(datos)
          //console.log(datos.alias.toUpperCase())

})
module.exports = router;