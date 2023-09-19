//SERVER CONF
const express = require('express');
const app = express();
const PORT = 3000;

//ARRANCA SERVER
app.listen(PORT, function() {
    console.log("SERVER RUNNNIG");
});

//JSON
var userData = {
    "user":[
        {
            "usuari" : "pol",
            "password" : "1234",
            "roles": ["admin", "ROL2"]
        },
        {
            "usuari" : "paco",
            "password" : "1234",
            "roles": ["guest", "ROL1"]
        },
        {
            "usuari" : "pablo",
            "password" : "1234",
            "roles": ["user", "ROL"]
        }
      ]
    };

    
    //var userDataStr= JSON.stringify(userData);
   // console.log(userDataStr[0].any)
    
//
app.get("/auth/user/:userid/password/:passwordid", getUsuarios);

function getUsuarios(req, res, userData ){
    console.log("params =>", req.params);
    objeto ={"isAuth": false, "roles" : []};
    
    if(req.params.userid== userData.user.usuari & req.params.passwordid== userData.user.password ){
        res.send( userDataStr= JSON.stringify(objeto));
    } else{
        res.send("NO POTS");
    }
}





