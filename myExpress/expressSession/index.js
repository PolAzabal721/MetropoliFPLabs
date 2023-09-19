//SERVER CONF
var express = require('express');
var app = express();
const PORT = 3000;
const session = require('express-session');

//SERVER ARRANCADO
app.listen(PORT, () =>
    console.log("SERVER RUNNING")
);

var sess = ({
    secret: 'palabra',
    resave: false,
    saveUnitialized: true,
    data: {
        count: 0
    }
    //cookie: { secure: true }
});

app.use(session(sess));

app.get("/hola", (req, res) => {
    sess.data.count++;
    console.log(sess);
    res.send("Hola mon => " + sess.data.count);
});

