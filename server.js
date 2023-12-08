const express = require('express');
const app = express();
const http = require('http');
const logger = require('morgan');
const cors = require('cors');
const { Server } = require("socket.io");






const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin: "*",
    methods: ["GET", "POST"]
  }
});


io.on('connection', (socket) => {
  console.log(`Se conectó un usuario: ${socket.id}`);

  // Manejar la desconexión del usuario
  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
    // Aquí puedes realizar cualquier acción que desees cuando un usuario se desconecte
  });
});



/**
 * Rutas
*/
const users = require('./routes/usersRoutes');
const task = require('./routes/taskRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());
app.disable('x-powered-by');


app.set('port', port);

// Llamado de las rutas.
users(app);
task(app);


server.listen(3000, '192.168.1.4' || 'localhost', function () {
  console.log('se inicio la aplicacion de manera correcta ' + port + ' se inicio...');
});
//Manejo de error 

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

module.exports = {
  app: app,
  server: server
};