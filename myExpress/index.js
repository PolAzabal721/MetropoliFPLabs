
//SERVER CONF
var app = express();
var session = require('express-session');

app.use(session({
    secret: 'keyboard',
    resave: false,
    saveUnitialized: true,
    cookie: { secure: true }
}));

//ACC SESION
app.get('/', (req, res)=>{
    console.log(req.sesion)
    res.send("Hello")
});











/*
//SERVER CONF
const express = require('express');
const app = express();
const PORT = 3000;

//ARRANCA SERVER
app.listen(PORT, function () {
    console.log("SERVER RUNNNIG");
});

//JSON
var userData = {
    "user": [
        {
            "usuari": "pol",
            "password": "1234",
            "roles": ["admin", "ROL2"]
        },
        {
            "usuari": "paco",
            "password": "1234",
            "roles": ["guest", "ROL1"]
        },
        {
            "usuari": "pablo",
            "password": "1234",
            "roles": ["user", "ROL"]
        }
    ]
};

//GET
app.get("/auth/user/:userid/password/:passwordid", getUsuarios);

function getUsuarios(req, res) {
    console.log("params =>", req.params);
    const objeto = { "isAuth": false, "roles": [] };

    for (let i = 0; i < userData.user.length; i++) {
        if (req.params.userid == userData.user[i].usuari && req.params.passwordid == userData.user[i].password) {
            objeto.isAuth = true;
            objeto.roles = userData.user[i].roles;
            break;
        }
    }

    if (objeto.isAuth) {
        res.send(objeto);
    } else {
        res.send("NO PUEDES ACCEDER");
    }
}
//http://localhost:3000/auth/user/pol/password/1234

//POST
app.post("/auth/user/:userid/password/:passwordid", postUsuarios);

function postUsuarios(req, res) {
    console.log("params =>", req.params);
    const objeto = { "isAuth": false, "roles": [] };

    for (let i = 0; i < userData.user.length; i++) {
        if (req.params.userid == userData.user[i].usuari && req.params.passwordid == userData.user[i].password) {
            objeto.isAuth = true;
            objeto.roles = userData.user[i].roles;
            break;
        }
    }

    if (objeto.isAuth) {
        res.send(objeto);
    } else {
        res.send("NO PUEDES ACCEDER");
    }
}
*/
