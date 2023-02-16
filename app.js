const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const session=require('express-session');
const bcrypt = require('bcrypt');
require('dotenv').config()
//console.log(process.env) 

app.use(express.urlencoded({extended:false}));
app.use(express.json());

//const { Cookie } = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }))


// parse application/json
app.use(bodyParser.json())

const expressLayouts=require('express-ejs-layouts');

app.use(session({
    secret:"soyUnaClave",
    saveUninitialized:true,
    resave:true
}))
//const ejs = require('ejs');

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


app.use(expressLayouts);
app.use('/router',require('./router/facturas/router'));
app.use('/proveedor',require('./router/proveedores/routerProv'));
app.use('/login',require('./router/login/routerLogin'));

app.get('/', (req, res)=>{
    res.send('esto funciona');
});


app.listen(3000,(req, res)=>{
    console.log('SERVER RUNNING IN htpp://lovalhost:3000');
});