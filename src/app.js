import express from "express"; 
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import { engine } from "express-handlebars"; 
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/product-manager.js"; // Mover la importación aquí

const app = express(); 
const PUERTO = 8080; // Trabajando con el puerto 8080

// Middleware: 
app.use(express.json()); 
app.use(express.static("./src/public")); // Asegúrate de que esta ruta sea correcta
app.use(express.urlencoded({ extended: true }));

// Configuración de express-handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter); 

// Crear servidor HTTP
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`); 
});

// Crear la instancia de socket.io
const io = new Server(httpServer);
const manager = new ProductManager("./src/data/productos.json");

// Manejo de conexiones de WebSocket
io.on("connection", async (socket) => {
    console.log("Un cliente se ha conectado");

    // Enviar el array de productos al cliente
    const productos = await manager.getProducts();
    socket.emit("productos", productos); // Envía la lista inicial de productos al cliente

    // Escuchar cuando se agregue un producto
    socket.on("nuevoProducto", async (producto) => {
        await manager.addProduct(producto);
        io.emit("productos", await manager.getProducts()); // Emitir productos actualizados a todos los clientes
    });

    // Escuchar cuando se elimine un producto
    socket.on("eliminarProducto", async (idProducto) => {
        await manager.deleteProduct(idProducto);
        io.emit("productos", await manager.getProducts()); // Emitir productos actualizados a todos los clientes
    });
});
