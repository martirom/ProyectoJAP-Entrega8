const express = require("express");
const jwt = require('jsonwebtoken');
const SECRET_KEY = "subgrupo3";
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//Obtener las categorías
app.get('/cats', (req, res) => {
    const filePath = path.join(__dirname,'emercado-api-main', 'cats', 'cat.json');

    //Lee el archvio cat.json
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error('Error leyendo el archivo:', err);
          res.status(500).send('Error interno del servidor');
          return;
        }
    
        // Convierte el contenido del archivo a un objeto JSON
        const categories = JSON.parse(data);
    
        // Envia las categorías como respuesta
        res.json(categories);
      });
});



//Obtener los productos de una categoría
app.get('/cats/:id', (req, res) => {
    const catID = req.params.id;
    const filePath = path.join(__dirname,'emercado-api-main', 'cats_products', `${catID}.json`);

    //Lee el archvio cat.json
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error(`Error leyendo el archivo ${categoryId}.json:`, err);
          res.status(500).send('Error interno del servidor');
          return;
        }
    
        // Convierte el contenido del archivo a un objeto JSON
        const products = JSON.parse(data);
    
        // Envia las categorías como respuesta
        res.json(products);
      });
});


//Obtener un producto según su id
app.get('/prods/:id', (req, res) => {
    const prodID = req.params.id;
    const filePath = path.join(__dirname,'emercado-api-main', 'products', `${prodID}.json`);

    //Lee el archvio cat.json
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error(`Error leyendo el archivo ${prodID}.json:`, err);
          res.status(500).send('Error interno del servidor');
          return;
        }
    
        // Convierte el contenido del archivo a un objeto JSON
        const product = JSON.parse(data);
    
        // Envia las categorías como respuesta
        res.json(product);
      });
});

//Obtener comentarios de un producto
app.get('/prodComment/:id', (req, res) => {
    const prodID = req.params.id;
    const filePath = path.join(__dirname,'emercado-api-main', 'products_comments', `${prodID}.json`);

    //Lee el archvio cat.json
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error(`Error leyendo el archivo ${prodID}.json:`, err);
          res.status(500).send('Error interno del servidor');
          return;
        }
    
        // Convierte el contenido del archivo a un objeto JSON
        const product = JSON.parse(data);
    
        // Envia las categorías como respuesta
        res.json(product);
      });
});

//Crear un nuevo comentario para un producto
app.post('/prodComment/:id', (req, res) => {
    const prodID = req.params.id;
    const filePath = path.join(__dirname,'emercado-api-main', 'products_comments', `${prodID}.json`);
  
    // Verifica si el archivo de comentarios para el producto específico existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`Error: El archivo ${prodID}.json no existe`);
        res.status(404).send('Producto no encontrado');
        return;
      }
  
      // Lee el archivo de comentarios del producto específico
      fs.readFile(filePath, 'utf-8', (err, fileData) => {
        if (err) {
          console.error(`Error leyendo el archivo ${prodID}.json:`, err);
          res.status(500).send('Error interno del servidor');
          return;
        }
  
        // Convierte el contenido del archivo a un objeto JSON
        const comments = JSON.parse(fileData);
        // Agrega el nuevo comentario al arreglo de comentarios
        const newComment = req.body.comment; // Asume que el comentario se proporciona en el cuerpo de la solicitud
        comments.push(newComment);
  
        // Escribe el arreglo actualizado de comentarios de nuevo al archivo
        fs.writeFile(filePath, JSON.stringify(comments, null, 2), 'utf-8', (err) => {
          if (err) {
            console.error(`Error escribiendo el archivo ${prodID}.json:`, err);
            res.status(500).send('Error interno del servidor al guardar el comentario');
            return;
          }
  
          // Devuelve el arreglo actualizado de comentarios como respuesta
          res.json(comments);
        });
      });
    });
});  

//Obtenemos el carrito
app.get('/cart/:id', (req, res) => {
    const userID = req.params.id;
    const filePath = path.join(__dirname,'emercado-api-main', 'user_cart', `${userID}.json`);

    //Lee la carpeta del carrito
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error('Error leyendo el archivo:', err);
          res.status(500).send('Error interno del servidor');
          return;
        }
    
        // Convierte el contenido del archivo a un objeto JSON
        const cart = JSON.parse(data);
    
        // Envia las categorías como respuesta
        res.json(cart);
      });
});

//Obtenemos el mensaje del archivo buy
app.get('/buy', (req, res) => {
    const filePath = path.join(__dirname,'emercado-api-main', 'cart', 'buy.json');

    //Lee la carpeta del carrito
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error('Error leyendo el archivo:', err);
          res.status(500).send('Error interno del servidor');
          return;
        }
    
        // Convierte el contenido del archivo a un objeto JSON
        const buy = JSON.parse(data);
    
        // Envia las categorías como respuesta
        res.json(buy);
      });
});

//Obtenemos el mensaje del archivo sell
app.get('/sell', (req, res) => {
    const filePath = path.join(__dirname,'emercado-api-main', 'sell', 'publish.json');

    //Lee la carpeta del carrito
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error('Error leyendo el archivo:', err);
          res.status(500).send('Error interno del servidor');
          return;
        }
    
        // Convierte el contenido del archivo a un objeto JSON
        const sell = JSON.parse(data);
    
        // Envia las categorías como respuesta
        res.json(sell);
      });
});

//Endpoint /login y autenticación mediante usuario y contraseña
app.post('/login', (req, res) => {
  const {username, password} = req.body;
  if (username === "admin" && password === "admin"){
    const token = jwt.sign((username), SECRET_KEY);
    res.status(200).json({token}); 
  }else{
    res.status(401).json({message: "Usuario y/o contraseña incorrecto"});
  }
});

//Middleware de autorización para la ruta /cart
app.use('/cart', (req, res, next) => {
try{
  const decoded = jwt.verify(req.headers['access-token'], SECRET_KEY);
  next();
} catch(err) {
  res.status(401).json({message: "Usuario no autorizado"});
}
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
