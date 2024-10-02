/** Chat comunitario - utilizando websockets y express-handlebars */

import express from "express";
import { engine } from "express-handlebars";
import router from "./routes/view.router.js";
import { Server } from "socket.io";

const app = express();
const port = 8080;

//Middlewares
app.use(express.json()); //notacion json
app.use(express.urlencoded({extended: true})); //datos complejos

app.use(express.static("./src/public"));

//Express Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas

app.use("/", router);

//Listen
const httpServer = app.listen(port, ()=> console.log(`Listening on port ${port}`));

//Genero una instancia de Socket.io del lado del backend
const io = new Server(httpServer);

//Array donde guardamos los usuarios y sus mensajes
let messages = [];

//Establecemos la conexión:
io.on("connection", (socket)=>{
    console.log("Un cliente se conectó");

    socket.on("message", data => {
        console.log(data);
        messages.push(data);

        //Emitimos mensaje para el cliente con el array messages
        io.emit("messagesLogs", messages);
    })
})