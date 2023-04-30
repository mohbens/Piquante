require('dotenv').config();
const http = require('http');
const app = require('./app');




const randomString = (nbChars) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = nbChars; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];

    console.log("*************************************")
    console.log(result)
    console.log("*************************************")
    return result;
  }

process.env.RANDOM_TOKEN = randomString(10);


// console.log("**************** ENVs *********************")
// console.log(process.env)
// console.log("*************************************")

const port = process.env.PORT || 3000;
console.log(port)
app.set('port', port);
const server = http.createServer(app);

server.listen(port);