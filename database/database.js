const mysql=require('mysql');
require('dotenv').config(({path:'./env/.env'}));

//console.log(process.env)
//console.log(host)

const conection=mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

conection.connect((error)=>{
    if(error){
        console.log('error de coneccion: '+error);
        return;
    }
    console.log('conexion exitosa');
});

module.exports=conection;