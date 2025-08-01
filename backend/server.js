// backend/server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let usuariosConectados = 0;

// Enviar archivos estáticos desde el frontend
app.use(express.static(path.join(__dirname, "../frontend")));

io.on("connection", (socket) => {
  usuariosConectados++;
  io.emit("userCount", usuariosConectados);

  socket.on("disconnect", () => {
    usuariosConectados--;
    io.emit("userCount", usuariosConectados);
  });
});

const HOST = "0.0.0.0"; // Escucha desde cualquier interfaz
const PORT = process.env.PORT || 3000;

server.listen(PORT, HOST, () => {
  console.log(`Servidor accesible en http://<ip-local>:${PORT}`);
});
