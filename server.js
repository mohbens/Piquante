require('dotenv').config(); //pour les variables d'environnement 
const http = require('http');
const app = require('./app');


// faire un random pour generer un Token a chaque fois que le Server est en marche
const randomString = (nbChars) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = nbChars; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

process.env.RANDOM_TOKEN = randomString(10);



const port = process.env.PORT || 3000;
app.set('port', port);
const server = http.createServer(app);

server.listen(port);