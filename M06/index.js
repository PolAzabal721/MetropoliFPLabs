const fs= require('fs');

let data ="\n Això és un fitxer que conté una collecció de llibres";

//ESCRIBIR TXT
fs.writeFile('Books.txt', data, (err)=>{
    if(err){
        console.log(err);
    } else{
        console.log("S'ha escrit en el fitxer amb èxit\n");
    }
});


/* AÑADIR TXT AL FICHERO
fs.appendFile('Books.txt', data, (err)=>{
    if(err){
        throw err;
    } else{
        console.log("S'ha afegit info en el fitxer");
    }
});
*/

//LEER TXT
fs.readFile('Books.txt', 'utf8', (err, data) =>{
    if(err){
        console.log(err);
    } else{
        console.log(data);
    }
});

