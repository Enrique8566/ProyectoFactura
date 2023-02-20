const { query, json } = require('express');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const session = require('express-session');
const { Cookie } = require('express-session');

const conection = require('../../database/database.js');
//const { destroy } = require('../database/database.js');
router.get('/datos', (req, res) => {
    if (req.session.usuario!=null) {
        conection.query('SELECT facturas.id AS id_F,factura_id,facturas.user_id AS user_id_F,iddoc,tipoDocumento,proveedor_id,ordenCompra_id,totalFactura,estado_id,obsAnulacion,fechaOficinaParte,comentario,facturas.created_at AS created_at_F,facturas.updated_at AS updated_a_F,proveedores.razonSocial FROM facturas INNER JOIN proveedores ON facturas.proveedor_id=proveedores.id',
        (err, resultados) => {
            const mostrar = Object.values(JSON.parse(JSON.stringify(resultados)));
            //console.log(mostrar)
            //console.log(err)
            res.render('./facturas/datos', {
                mostrar: mostrar
            })
        })
    }else{
        console.log('no ingresado')
        res.redirect('/login/login?')
    }


})
router.get('/guardarFactura', (req, res) => {
    if(req.session.usuario!=null){
        conection.query(`SELECT id,razonSocial FROM proveedores`, (err, resultados) => {
            const proveedores = Object.values(JSON.parse(JSON.stringify(resultados)));
            const fecha = new Date()
            const fechaMax = [fecha.getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date().getDate())).slice(-2)];
            //console.log(fechaMax)
            let value = {
                estado: 0,
                idFactura: "",
                iddoc: "",
                OrdenCompra: "",
                totalFactura: "",
            }
            let galleta = {
                idFactura: "null",
                iddoc: "null",
                tipoDocumento: "null",
                idProvedor: "null",
                OrdenCompra: "null",
                totalFactura: "null",
                Estado: "null",
                FechaRecepcion: "null",
                Comentario: "null"
            }
           
    
            
            if(req.session.datosC!=null){
                galleta = req.session.datosC
                req.session.datosC = null
            }
                req.session.datosC = null
            
            if (req.session.value != null) {
                value = req.session.value
                req.session.value = null
                //console.log(value)
                //conection.query(`SELECT id,razonSocial FROM proveedores WHERE id="${galleta.}"`)
            }
            req.session.value = null
    
            if(value.estado!=0){
                conection.query(`SELECT id,razonSocial FROM proveedores WHERE id="${galleta.idProvedor}"`,(err,result)=>{
                    let prov= Object.values(JSON.parse(JSON.stringify(result)));
    
                    //console.log(galleta.idProvedor)
                    //console.log(prov)
                    res.render('./facturas/guardar', {
                        proveedores: proveedores,
                        fechaMax: fechaMax,
                        value: value,
                        galleta: galleta,
                        prov:prov[0]
                    })
    
                })
            }else{
                res.render('./facturas/guardar', {
                    proveedores: proveedores,
                    fechaMax: fechaMax,
                    value: value,
                    galleta: galleta
                })
            }
                
        }) 
    }else{
        console.log('no ingresado')
        res.redirect('/login/login?')
    }
})



router.post('/guardarFactura', (req, res) => {
    const datos = req.body
    const fecha = new Date()
    const fechaMax = [fecha.getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date().getDate())).slice(-2) + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()];
    let datosC = {
        idFactura: req.body.nFactura,
        iddoc: req.body.IDDOC_h,
        tipoDocumento: req.body.Documento,
        idProvedor: req.body.Proveedor,
        OrdenCompra: req.body.OrdenCompra,
        totalFactura: req.body.TotalFactura,
        FechaRecepcion: req.body.FechaRecepcion,
        Comentario: req.body.Comentario,
        usuario: '8566',
        obs: 'prueba de null',
    }
    console.log(req.body.FechaRecepcion)
    console.log()

    //console.log("despues del if:"+datosC.Comentario)

    //declara la cooki el el post  con los las variables ya declaradas
    req.session.datosC = datosC
    //console.log("galleta:")
    //console.log(req.session.datosC)

    req.session.value = {
        estado: 0,
        idFactura: "",
        iddoc: "",
        OrdenCompra: "",
        totalFactura: "",
    }
    //console.log(fechaMax + "\n" + fecha)
    if (datosC.idFactura[0] == "0") {
        req.session.value.idFactura = " N° de factura incorrecto \n"
        req.session.value.estado = 1
    }
    if (datosC.iddoc[0] == "0") {
        req.session.value.iddoc = "El IDDOC es incorrecto \n"
        req.session.value.estado = 1
    }
    if (datosC.OrdenCompra[0] == "0") {
        req.session.value.OrdenCompra = "Orden de Compra incorrecta \n"
        req.session.value.estado = 1
    }
    if (datosC.totalFactura[0] == "0") {
        req.session.value.totalFactura = "Total de factura incorrecto "
        req.session.value.estado = 1
    }

    if (req.session.value.estado == 1) {
        res.redirect('back')
        return;
    } else {
        let scrp = `INSERT INTO facturas SET factura_id = "${datosC.idFactura}",user_id = "${datosC.usuario}",iddoc = "${datosC.iddoc}",tipoDocumento = "${datosC.tipoDocumento}",proveedor_id = "${datosC.idProvedor}",ordenCompra_id = "${datosC.OrdenCompra}",totalFactura = "${datosC.totalFactura}",estado_id = "4",fechaOficinaParte = "${datosC.FechaRecepcion}",created_at = "${fechaMax}",updated_at = "${fechaMax}"`
        if (datosC.Comentario != "") {
            scrp += `,comentario="${datosC.Comentario}"`
        }
        conection.query(scrp,
            (err, resultado) => {
                if (err) throw err;
                //console.log('Registro guardado ' + resultado)
                //console.log(resultado)
                req.session.value=null
                req.session.datosC = null
                res.redirect('/router/datos')
            })
    }
})
//console.log();
router.get('/editar/:id', (req, res) => {
    if (req.session.usuario!=null) {
        let id = req.params.id
        //console.log(id)
        conection.query(`SELECT facturas.id AS id_F,factura_id,facturas.user_id AS user_id_F,iddoc,tipoDocumento,proveedor_id,ordenCompra_id,totalFactura,estado_id,obsAnulacion,fechaOficinaParte,comentario,facturas.created_at AS created_at_F,facturas.updated_at AS updated_a_F,proveedores.razonSocial FROM facturas INNER JOIN proveedores ON facturas.proveedor_id=proveedores.id WHERE facturas.id="${id}"`,
            (err, resultados) => {
                const mostrar = Object.values(JSON.parse(JSON.stringify(resultados)));
                conection.query('SELECT id AS proveedor_id,razonSocial FROM proveedores', (err, result) => {
                    //console.log(result);
                    //WHERE id=?', [mostrar[0].proveedor_id]
                    const datoProv = Object.values(JSON.parse(JSON.stringify(result)));
    
                    res.render('./facturas/cambios', {
                        mostrar: mostrar[0],
                        datoProv: datoProv
                    })
                })
            })
    }else{
        console.log('no ingresado')
        res.redirect('/login/login?')
    }

})
router.get('/Eliminar/:id', (req, res) => {
    let idFactura = req.params.id
    console.log(idFactura)
    conection.query(`DELETE FROM facturas WHERE id="${idFactura}"`,
        (err, resultado) => {
            if (err) {
                console.log(err),
                    res.redirect('back')
            } else (
                console.log('datos borrados'),
                res.redirect('/router/datos')
            )
        })
})
router.post('/anular', (req, res) => {
    const fecha = new Date()
    const fechaMax = [fecha.getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date().getDate())).slice(-2) + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()];
    let actu = {
        id: req.body.idFactura,
        obs: req.body.obsAnulacion
    }
    console.log('datos:')
    console.log(actu)
    conection.query(`UPDATE facturas SET estado_id="5", obsAnulacion="${actu.obs}", updated_at="${fechaMax}" WHERE id="${actu.id}"`,
        (err, result) => {
            res.redirect('back')
        })

})

router.post('/editar', (req, res) => {
    //let newData = req.body
    const fecha = new Date()
    const fechaMax = [fecha.getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date().getDate())).slice(-2) + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()];
    let newData = {
        idFactura: req.body.idFactura,
        usuario: req.body.idUsuario,
        nFactura: req.body.nFactura,//*
        iddoc: req.body.iddoc,//*
        totalFactura: req.body.totalFactura,//*
        documento: req.body.tipoDocumento,//*
        estado: req.body.estado,
        OrdenCompra: req.body.OrdenCompra,//*
        proveedor: req.body.Proveedor,//*
        Comentario: req.body.comentario,//*
        obsAnulacion: req.body.obsAnulacion,//*
    }
    console.log('datos:')
    console.log(newData)
    let consulta = `UPDATE facturas SET factura_id="${newData.nFactura}",iddoc="${newData.iddoc}",tipoDocumento="${newData.documento}",proveedor_id="${newData.proveedor}",ordenCompra_id="${newData.OrdenCompra}",totalFactura="${newData.totalFactura}",obsAnulacion="${newData.obsAnulacion}",updated_at="${fechaMax}"`
    if (newData.Comentario != "") {
        consulta += `,comentario="${newData.Comentario}"`
    }
    conection.query(consulta + ` WHERE facturas.id="${newData.idFactura}"`,
        (err, result) => {
            res.redirect('back')
        })

})

router.get('/nombre', function (req, res) {

    res.send('funcion nombre');
    console.log("hola");
})

module.exports = router;

// guardar cosas--const nombre = req.body.nombrevariable