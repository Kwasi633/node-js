const http = require("http")

const server = http.createServer((req, res) => {
    if(req.url === '/'){
        res.write('Welcome to our homepage')
    }
    
})

server.listen(5000)