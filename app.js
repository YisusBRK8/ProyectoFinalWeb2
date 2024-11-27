const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { request } = require('http');
const { error } = require('console');

//instanciar
const app = express();
//puerto
const port = 3008;

app.use(bodyParser.urlencoded({ extend: false }));

//analizar los datos del cuerpo de las solicitudes http, 

//motor de plantillas para html de forma dinamica 

app.set('view engine', 'ejs');
//configurarlo con nuestro puerto y todo lo demas que tengamos 
//maneja la conexion de la base de datos
//credenciales para la db
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'node_crud',
    port: '3306'
});

//conexion para la db
db.connect(err => {
    if (err) {
        console.log(`Error al momento de la conexion BB ${err} :3 `)
    } else {
        console.log(`conexión realizada :3`)
    }
});

//server inicio 

app.listen(port, () => {
    console.log(`El server rest en escucha desde http://localhost: ${port}`)
});

//Mostrar lista información 
app.get('/', (req, res) => {
    //consulta a la base de datos
    const query = 'SELECT * FROM user';
    //trabajar con la conexión
    db.query(query, (err, results) => {
        if (err) {
            //mensaje de error para el usuario
            console.error(`Error al recuperar datos. Codigo de error: ${err}`);
            res.send('Error en recuperar datos');
        } else {
            //render manda la informacion a la plantilla *configurable dependiendo de nuestea base de datos
            res.render('index', { users: results });
        }
    });
});

//agregar usuario

app.post('/add', (req, res) => {
    const { name, email } = req.body;//se agarra atraves del protocolo http
    const query = 'INSERT INTO users (name, email) VALUE (?,?)';
    db.query(query, [name, email], (err) => {
        if (err) {
            console.error(`Error al insertar en usuarios: codigo->${err} `);
            res.send('Error');
        } else {
            res.redirect('/');
        }
    });
});

//editar usuario

app.get('/edit/:id', (req, res => {
    const { id } = req.params;//se extrae atraves del html
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], (err, results => {
        if (err) {
            console.log('Error en la DB');
            res.send("Error en la DB");
        } else {
            res.render('edit', { user: results[0] });
        }
    }));
}));

//Eliminar

app.get('/delete/:id', (req, res => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error en el Delete');
            res.send("Error al eliminar");
        } else {
            res.redirect('/')
        }
    });
}));