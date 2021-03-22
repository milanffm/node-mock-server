const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 4123

server.use(jsonServer.bodyParser)
server.use(middlewares)


server.get('/api/users', (request, response) => {
if (request.method === 'GET') {
        const users = require('./api/users')
        response.status(200).jsonp(users())
    }
})

server.listen(port, () => {
console.log(` \n ================================== \n 
JSON Server is running on: \nhttp://localhost:${port}\n
================================== \n `);
})