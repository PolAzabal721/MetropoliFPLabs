const express = require('express');
const app = express();
const PORT = 3000;

//PATH
app.get("/normal", getNormal);

app.get("/", function(req, res) {
    console.log("petición recibida");
    res.send("Hola anonimo");
});

app.get("/arrow", (req, res)=>{
    res.send("Hola desde arrow");

});

app.get("/auth/user/:userid/passw/:passwid", function(req, res){
    console.log(req.params);
    res.send("auth paga");
});

//ARRANCA SERVER
app.listen(PORT, function() {
    console.log("SERVER RUNNNIG");
});


function getNormal(req, res){
    
    console.log("params =>", req.params);
    console.log("query =>", req.query);
    if(req.query.nom=="Pol"& req.query.passw=="1234"){
        res.send("Hola " + req.query.nom + ", des de funcion normal");
    } else{
        res.send("NO POTS");
    }
}


