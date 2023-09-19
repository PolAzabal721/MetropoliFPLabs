//SERVER CONF
const express = require('express');
const app = express();
const PORT = 3002;

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

function getUsuarios(req, res){
    console.log("params =>", req.params);
    objeto ={"isAuth": false, "roles" : []};
    
    var userDataStr= JSON.stringify(userData);

    for ( i = 0; i < userData.user.length; i++) {
        if (req.params.user == userData.user[i].usuari && req.params.password == userData.user[i].password) {
            objeto.isAuth = true;
            objeto.roles = userData.user[i].roles;
            //console.log(objeto.roles);
           // res.send(objeto);
    } else{
        res.send("NO POTS");
    }
}
}





