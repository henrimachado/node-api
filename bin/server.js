'use srict' //Força que o javascript seja mais criteriozo, como por exemplo com uso de ponto e vírgula no código. 

//Criando o servidor
//Tudo que é colocado com um nome, sem o caminho, é buscado na pasta node modules. 
const app = require('../src/app');
const http = require('http');
const debug = require('debug')('nodestr:server'); //foi dado um nome


const port = normalizePort(process.env.PORT || '3000'); //Ele passa uma porta retirada do enviroment ou a porta 3000 caso não retorne nenhuma. 
app.set('port', port);


//Criando o servidor
const server = http.createServer(app);


server.listen(port);
server.on('error', onError); //Disparando eventos de erro
server.on('listening', onListening);
console.log(`Servidor está ouvindo na porta ${port}: http://localhost:${port}/`);

//Normalização da porta
function normalizePort (val) {
    const port = parseInt(val, 10);

    if (isNaN(port)){
        return val;
    } 

    if (port >= 0) {
        return port;
    }

    return false;
};

//Tratamento de erros do servidor
function onError(error){
    if (error.syscall !== 'listen') {
        throw error;
    };

    const bind = typeof port === 'string' ? 
        'Pipe ' + port : 
        'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default: 
            throw error;
    };

};

//Debug
function onListening(){
    const addr = server.address();
    const bind = typeof addr === 'string'
    ? 'pipe ' + addr 
    : 'port ' + addr.port;
    debug('Listening on ' + bind);
};