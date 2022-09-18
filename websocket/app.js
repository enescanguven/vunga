const http = require('http')
const fs = require('fs')

var privateKey = fs.readFileSync( 'key.pem' );
var certificate = fs.readFileSync( 'cert.pem' );

const server = http.createServer((req, res) => {
    key: privateKey;
    cert: certificate;
    res.writeHead(200, { 'content-type': 'text/html' })
    fs.createReadStream('index.html').pipe(res)
})

server.listen(process.env.PORT || 3131) 